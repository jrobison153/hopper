let tickerSourceFactory = {}

export default tickerSourceFactory

let tickerDataSource = null

tickerSourceFactory.setDataSource = function(dataSource) {

    tickerDataSource = dataSource
}

tickerSourceFactory.getDataSource = function () {

    return tickerDataSource

}