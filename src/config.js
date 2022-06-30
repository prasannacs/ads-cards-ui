var config = {}

config.backend = {}
config.backend.host = 'http://localhost:4080' 
config.backend.mediaUpload = config.backend.host + '/media/upload'
config.backend.createCard = config.backend.host + '/cards/create-card'
config.backend.createCarousel = config.backend.host + '/cards/create-carousel'
config.backend.tweet = config.backend.host + '/cards/tweet'
config.backend.getCards = config.backend.host + '/cards'
config.backend.requestToken = config.backend.host + '/login/request-token'
config.backend.accessTokens = config.backend.host + '/login/access-tokens'
config.backend.mediaLibrary = config.backend.host + '/media/library'

module.exports = config;