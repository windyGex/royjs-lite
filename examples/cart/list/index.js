import React, { useEffect } from 'react';
import { category, sortMethods } from '../config';
import { useStore, useDispatch } from '../../../src/';
import './store';

export default function List(props) {
    const list = useStore(state => state.list);
    const dispatch = useDispatch();
    const renderCategory = data => {
        return data.map(item => {
            return (
                <li
                    className={`cate ${list.currentCategory === item.id ? 'tab-active' : ''}`}
                    key={item.id}
                    onClick={() => {
                        dispatch('list.fetch', {
                            category: item.id
                        });
                    }}>
                    {item.des}
                </li>
            );
        });
    };
    const renderFilter = data => {
        return data.map(item => {
            return (
                <li
                    className={`filter-opt ${list.currentSort === item.value ? 'filter-active' : ''}`}
                    key={item.value}
                    onClick={() => {
                        dispatch('list.sortList', item.value);
                    }}>
                    {item.name}
                </li>
            );
        });
    };
    const renderList = data => {
        return data.map(item => {
            return (
                <li className="goods-item" key={item.id}>
                    <div className="goods-img">
                        <img src={item.img} />
                        <div className="flag">热</div>
                    </div>
                    <div className="goods-info">
                        <p className="goods-title">{item.name}</p>
                        <div className="goods-price">
                            <span>
                                ¥<b>{item.price}</b>
                            </span>
                        </div>
                        <span className="des">{item.sales}人付款</span>
                        <span
                            className="save"
                            onClick={() => {
                                dispatch('cart.addCartItem', item);
                            }}>
                            +
                        </span>
                    </div>
                </li>
            );
        });
    };
    useEffect(() => {
        dispatch('list.fetch');
    }, []);
    console.log('list, render');
    return (
        <div className="device" id="page-list">
            <header>
                <span className="header-title">商品列表</span>
            </header>
            <div className="page">
                <div className="tab-wrap">
                    <ul className="cate-tab">{renderCategory(category)}</ul>
                </div>
                <ul className="filter-bar">{renderFilter(sortMethods)}</ul>
                <ul className="goods-list">{renderList(list.goods)}</ul>
            </div>
            {list.loading ? <div className="loading">loading...</div> : null}
        </div>
    );
}
