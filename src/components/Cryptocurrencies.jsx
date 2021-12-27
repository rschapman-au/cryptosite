import React, {useState, useEffect, useRef} from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input } from 'antd';

import { useGetCryptosQuery } from '../services/cryptoApi';

const Cryptocurrencies = ({ simplified }) => {
    const count = simplified ? 10 : 100;
    const { data, isFetching } = useGetCryptosQuery(count);
    const [cryptos, setCryptos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const initial = useRef(true);

    useEffect(()=>{
        if (initial.current === true) {
            initial.current = false;
            setCryptos(data?.data?.coins);
            return;
        }
        const timer = setTimeout(() => {
            const filteredCoins = data?.data?.coins.filter((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()))
            setCryptos(filteredCoins)
        }, 600)

        return () => clearTimeout(timer);
    },[data, searchTerm]);  

    if(isFetching) return 'Data loading...'

    return (
        <>
            <div className="search-crypto">
                <Input placeholder="Search Crytocurrency" onChange={(e)=>setSearchTerm(e.target.value)}/>
            </div>
            <Row gutter={[32, 32]} className="crypto-card-container">
                {cryptos?.map((currency) => (
                    <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.id}>
                        <Link to={`/crypto/${currency.id}`}>
                            <Card 
                                title={`${currency.rank}. ${currency.name}`}
                                extra={<img className="crypto-image" src={currency.iconUrl} alt="Crypto"/>}
                                hoverable
                                >
                                <p>Price: {millify(currency.price)}</p>
                                <p>Market Cap: {millify(currency.marketCap)}</p>
                                <p>Daily Change: {millify(currency.change)}%</p>
                            </Card>   
                        </Link>
                    </Col>
                ))}
            </Row>
           
        </>
    )
}

export default Cryptocurrencies
