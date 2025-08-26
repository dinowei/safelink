import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        riskLevel: {
            type: Type.STRING,
            enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH],
            description: 'The assessed risk level.'
        },
        summary: {
            type: Type.STRING,
            description: 'A brief summary of the analysis.'
        },
        details: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: 'A list of specific findings or reasons for the assessment.'
        },
        recommendation: {
            type: Type.STRING,
            description: 'An actionable recommendation for the user.'
        }
    },
    required: ["riskLevel", "summary", "details", "recommendation"],
};


const parseAndValidateResponse = (text: string): AnalysisResult => {
    try {
        const parsed = JSON.parse(text);
        if (
            parsed.riskLevel && Object.values(RiskLevel).includes(parsed.riskLevel) &&
            typeof parsed.summary === 'string' &&
            Array.isArray(parsed.details) && parsed.details.every((item: unknown) => typeof item === 'string') &&
            typeof parsed.recommendation === 'string'
        ) {
            return parsed as AnalysisResult;
        }
        throw new Error("Parsed JSON does not match the AnalysisResult structure.");
    } catch (e) {
        console.error("Failed to parse or validate Gemini response:", e);
        throw new Error("Recebemos uma resposta inválida do serviço de análise.");
    }
};

const callGemini = async (prompt: string, imagePart?: { inlineData: { data: string, mimeType: string } }): Promise<AnalysisResult> => {
    const contents = imagePart ? { parts: [{ text: prompt }, imagePart] } : prompt;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2
            },
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error("Received an empty response from the Gemini API.");
        }
        
        return parseAndValidateResponse(responseText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha ao analisar o conteúdo. Por favor, tente novamente mais tarde.");
    }
};

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
    const prompt = `Analise a seguinte URL para sinais de ser um site fraudulento ou de phishing: "${url}".
    
    Considere a estrutura do domínio, TLD, presença de palavras-chave suspeitas (ex: 'login', 'secure', 'account', 'banco'), uso de caracteres (ex: hifens), e padrões comuns de phishing. Forneça um nível de risco (LOW, MEDIUM, HIGH), um resumo curto, alguns pontos explicando seu raciocínio, e uma recomendação clara e acionável para o usuário.
    
    A saída deve ser apenas o objeto JSON descrito no schema.`;
    return callGemini(prompt);
};

export const analyzeTextContent = async (text: string): Promise<AnalysisResult> => {
    const prompt = `Analise o seguinte texto para sinais de ser fraudulento ou parte de uma tentativa de phishing.
    
    Procure por links suspeitos, pedidos urgentes de informações pessoais (senhas, detalhes bancários), erros de gramática, linguagem ameaçadora ou ofertas que são boas demais para ser verdade. Forneça um nível de risco (LOW, MEDIUM, HIGH), um resumo, pontos explicando suas descobertas, e uma recomendação clara e acionável para o usuário.
    
    Texto para analisar: "${text.substring(0, 3000)}" 
    
    A saída deve ser apenas o objeto JSON descrito no schema.`;
    return callGemini(prompt);
};


export const analyzeImageContent = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
    const prompt = `Analise esta captura de tela de um site ou mensagem para sinais de ser uma tentativa de fraude ou phishing.
    
    Procure por logotipos incomuns, avisos urgentes, campos de entrada suspeitos para informações sensíveis, erros de digitação, erros gramaticais ou URLs enganosas visíveis na imagem. Forneça um nível de risco (LOW, MEDIUM, HIGH), um resumo, pontos explicando suas descobertas, e uma recomendação clara e acionável para o usuário.
    
    A saída deve ser apenas o objeto JSON descrito no schema.`;

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType
        }
    };
    return callGemini(prompt, imagePart);
};