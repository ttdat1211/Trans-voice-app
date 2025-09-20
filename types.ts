export interface Language {
  name: string;
  code: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { name: 'Chinese (Mandarin)', code: 'zh-CN' },
  { name: 'English', code: 'en-US' },
  { name: 'French', code: 'fr-FR' },
  { name: 'German', code: 'de-DE' },
  { name: 'Italian', code: 'it-IT' },
  { name: 'Japanese', code: 'ja-JP' },
  { name: 'Korean', code: 'ko-KR' },
  { name: 'Portuguese', code: 'pt-BR' },
  { name: 'Russian', code: 'ru-RU' },
  { name: 'Spanish', code: 'es-ES' },
  { name: 'Vietnamese', code: 'vi-VN' },
];
