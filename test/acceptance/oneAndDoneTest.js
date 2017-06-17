import {expect} from 'chai'
import requestPromise from 'request-promise'
import server from '../../src/server'
import fakeTickerSource from '../fakes/fakeTickerSource'
import tickerSourceFactory from '../../src/io/tickerSourceFactory'

describe('Tests for behaviors that process all un-decorated tickers', () => {

    beforeEach(() => {

        tickerSourceFactory.setDataSource(fakeTickerSource)

        return server.start()
    });

    afterEach(() => {

        server.stop()
    })


    describe('When orchestrating the decoration of tickers', () => {

        it('Then only tickers without a chromosome are processed', () => {

            const tickerWithChromosomeId = '58b3fe41d13742ff314f2a4f'

            return batchProcessTickers().then((processedTickers) => {

                expect(processedTickers).to.not.include(tickerWithChromosomeId)
            });
        })
    })

    async function batchProcessTickers() {

        const processResponse = await processTickers()
        return getProcessedTickers(processResponse.id)
    }

    function processTickers() {

        const options = {
            method: 'POST',
            uri: 'http://localhost:8080/chromosomes',
        };

        return requestPromise(options).then((data) => {

            return data
        }).catch((err) => {

            console.log(err.toString())
        })
    }

    function getProcessedTickers(resourceId) {

        const options = {
            method: 'GET',
            uri: `http://localhost:8080/chromosomes/${resourceId}`
        }

        return requestPromise(options).then((data) => {

            return data
        }).catch((err) => {

            console.log(err.toString())
        })
    }
})


