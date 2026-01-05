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

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter(word => word && !STOPWORDS.has(word))
    .join(' ');
}