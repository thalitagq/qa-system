/* eslint-disable prettier/prettier */
const STOPWORDS = new Set([
  // PT (artigos/pronomes/conectivos)
  'a', 'o', 'as',  'os',  'um',  'uma',  'uns',  'umas',  
  'de',  'da',  'do',  'das',  'dos',  'e', 'ou',  'em',  'no',  'na',  
  'nos',  'nas', 'para',  'por',  'com',  'sem',  'sobre',  'entre',  'até',  
  'ao',  'aos',  'à', 'às',
  // EN (artigos/preposições/conectivos)
  'the', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'for', 'by', 'with', 
  'without',  'between',  'into', 'over', 'under'
]);

export function normalizeText(text: string): string {
  const words = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');

  console.log(words.map(w => `${JSON.stringify(w)} => ${STOPWORDS.has(w)}`));

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s]/g, ' ')    // ⚠️ troca por espaço, não ''
    .replace(/\s+/g, ' ')            // normaliza espaços
    .trim()
    .split(' ')
    .filter(word => word.length > 2 && !STOPWORDS.has(word))
    .join(' ');
    
}