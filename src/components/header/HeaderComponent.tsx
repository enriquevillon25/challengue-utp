import React, { useState } from 'react';
import './HeaderComponent.scss'
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Logo from '../../assetss/logo.jpg'
import { Product } from '../../interfaces/product';
interface Props {
    badge?: number;
    totalPrice?: number;
}
const HeaderComponent = ({ badge, totalPrice }: Props) => {

    const [activeCart, setActiveCart] = useState<boolean>(false)
    return (
        <>
            <div className="container__header">
                <img src={Logo} style={{ width: '20%' }} />
                <div className="subcontainer__header">
                <IconButton aria-label="cart" onClick={() => setActiveCart(!activeCart)}>
                    <Badge badgeContent={badge} color="primary">
                        <ShoppingCartIcon />

                    </Badge>
                </IconButton>
                {
                    (activeCart ) && <>
                        <div >
                            <p> {totalPrice} </p>
                        </div>       
                    </>
                }
                </div>
        
               
            </div>
        </>
    )
}

export default HeaderComponent;