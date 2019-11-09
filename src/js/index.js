//outputs css to our dist folder
import '../scss/index.scss'
import '../scss/application.scss'

//copies assets to dist
require.context('./../../assets')
