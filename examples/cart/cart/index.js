import React, { useState, useEffect } from 'react';
import { connect } from '../../../src';
import CartList from './cart-list';
import './store';
import { useStore, useDispatch } from '../../../src/hooks';

export default function Cart(props) {
    const cart = useStore(state => state.cart);
    const [isEdit, edit] = useState(false);
    const dispatch = useDispatch();
    console.log('cart, render');
    const selectedItems = cart.list.filter(item => item.selected);
    const selectedNum = selectedItems.length;
    const totalPrice = selectedItems.reduce((total, item) => {
        total += item.quantity * item.price;
        return total;
    }, 0);
    const checked = selectedItems.length === cart.list.length && selectedItems.length > 0;
    return (
        <div className="device" id="page-cart">
            <header>
                <span className="header-title">购物清单</span>
                <span className="header-edit">{!isEdit ? <span onClick={() => edit(true)}>编辑</span> : <span onClick={() => edit(false)}>完成</span>}</span>
            </header>
            <div className="page">
                <CartList />
            </div>
            <div className="action-bar">
                <div className="g-selector">
                    <div className="item-selector">
                        <div className="icon-selector">
                            <input
                                type="checkbox"
                                onChange={e => {
                                    dispatch('cart.selectAll', {
                                        checked: e.target.checked,
                                    });
                                }}
                                checked={checked}
                            />
                        </div>
                    </div>
                    <span>全选</span>
                </div>
                {!isEdit ? (
                    <div className="action-btn buy-btn">去结算({selectedNum})</div>
                ) : (
                    <div
                        className="action-btn del-btn"
                        onClick={() => {
                            dispatch('cart.onRemove');
                        }}>
                        删除({selectedNum})
                    </div>
                )}
                <div className="total">
                    合计：
                    <span>
                        ¥<b>{totalPrice}</b>
                    </span>
                </div>
            </div>
        </div>
    );
}
