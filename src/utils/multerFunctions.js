const regex = require("../utils/regex");
const path = require("path");

/**
 * Retorna o caminho da url
 * @param {String} baseUrl
 * @returns {String} urlPath
 * @example
 * getURLPath("/api/artworks") // "artworks"
 */

const getURLPath = (baseUrl) => {
  return baseUrl.replace("/", "").split("/")[1];
};

/**
 * Retorna o caminho base para o arquivo imagem ou áudio
 * @param {String} field
 * @returns {String} basePath
 * @example
 * getBasePath("audioDesc") // "audio"
 */
const getBasePath = (field) => {
  const type = field.match(regex.fieldNameTypes);
  return type ? type[0] : null;
};

/**
 * Função para determinar o tipo de áudio, descrição ou guia
 * @param {String} field
 * @returns {String} type
 * @example
 * getAudioType("audioDesc") // "desc"
 */
const getAudioType = (field) => {
  const type = field.toLowerCase().match(regex.audioTypeRegex);
  return type ? type[1] : null;
};

/**
 * Função para determinar o idioma do áudio
 * @param {String} name
 * @returns {String} lang
 * @example
 * getAudioLang("audio-desc-br") // "br
 */
const getAudioLang = (name) => {
  const lang = name.match(regex.audioLangRegex);
  return lang ? lang[1] : null;
};

/**
 * Função para construir o caminho completo
 * @param {String} basePath - Nome do campo
 * @param {String} baseUrl - URL base
 * @param {String} type - Tipo de áudio, caso exista
 * @returns {String} path
 * @example
 * buildPath("audio", "/api/artworks", "desc") // "audios/artworks/desc"
 */
const buildPath = (basePath, baseUrl, type = "", lang = "") => {
  return `${basePath}s/${getURLPath(baseUrl)}${type ? `/${type}/${lang}` : ""}`;
};

/**
 * Função principal, agora focada apenas na orquestração das funções
 * @param {String} field - Nome do campo
 * @param {String} baseUrl - URL base
 * @param {String} originalName - Nome original do arquivo
 * @returns {String} advancedPath
 * @example
 * getAdvancedPath("audioDesc", "/api/artworks", "sdfsdfadfas-br.mp3") // "audios/artworks/desc/br"
 * getAdvancedPath("image", "/api/artworks") // "images/artworks
 */
const getAdvancedPath = (field, baseUrl, originalName) => {
  const basePath = getBasePath(field);
  if (basePath === "audio") {
    const audioType = getAudioType(field);
    const audioLang = getAudioLang(originalName);
    return buildPath(basePath, baseUrl, audioType, audioLang);
  }
  return buildPath(basePath, baseUrl);
};

/**
 * Função para remover a extensão do nome
 * @param {String} name
 * @returns {String} nameWithoutExt
 * @example
 * nameWithoutExt("file.jpg") // "file"
 */

const nameWithoutExt = (name) => {
  return path.basename(name, path.extname(name));
};

/**
 * Retorna o nome dos arquivos
 * @param {Array<Object>} array
 * @returns {Array<String>} names
 * @example
 * getFileNames([{filename: "file1"}, {filename: "file2"}]) // ["file1", "file2"]
 */

const getFileNames = (array) => {
  const names = array.map((item) => {
    return item.filename;
  });
  return names;
};

module.exports = {
  getURLPath,
  getBasePath,
  getFileNames,
  getAdvancedPath,
  getAudioType,
  getAudioLang,
  buildPath,
  nameWithoutExt,
};
