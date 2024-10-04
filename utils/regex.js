module.exports = {
  imageFileTypes: /\.(png|jpg)$/i, // usado para identificar o tipo de arquivo de imagem
  audioFileTypes: /\.(mp3|mp4)$/i, // usado para identificar o tipo de arquivo de áudio
  fieldNameTypes: /audio|image$/i, // usado para identificar o tipo de arquivo com base no fieldname
  audioLangRegex: /-(br|en)/i, // usado para identificar o idioma dos arquivos de áudio
  audioTypeRegex: /(desc|guia)/i, // usado para identificar o tipo dos arquivos de áudio
};