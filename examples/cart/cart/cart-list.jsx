import React from 'react';
import { useStore, useDispatch } from '../../../src';

export default function CardList(props) {
    const list = useStore(state => state.cart.list);
    const dispatch = useDispatch();
    const renderList = data => {
        return data.map(item => {
            return (
                <li className="goods-item" key={item.id}>
                    <div className="item-selector">
                        <div className="icon-selector">
                            <input
                                type="checkbox"
                                onChange={e => {
                                    dispatch('cart.select', {
                                        id: item.id,
                                        checked: e.target.checked
                                    });
                                }}
                                checked={item.selected}
                            />
                        </div>
                    </div>
                    <div className="goods-img">
                        <img src={item.img} />
                    </div>
                    <div className="goods-info">
                        <p className="goods-title">{item.name}</p>
                        <div className="goods-price">
                            <span>
                                ¥<b>{item.price}</b>
                            </span>
                        </div>
                        <span className="des">库存{item.stock}件</span>
                        <div className="goods-num">
                            <div
                                className="num-btn"
                                onClick={e => {
                                    dispatch('cart.onAdd', item);
                                }}>
                                +
                            </div>
                            <div className="show-num">{item.quantity}</div>
                            <div
                                className="num-btn"
                                onClick={e => {
                                    dispatch('cart.onReduce', item);
                                }}>
                                -
                            </div>
                        </div>
                    </div>
                </li>
            );
        });
    };
    console.log('cartlist, render');
    if (list.length) {
        return <ul className="goods-list cart-list">{renderList(list)}</ul>;
    }
    return (
        <div className="empty-states">
            <span>这里是空的，快去逛逛吧</span>
        </div>
    );
}
