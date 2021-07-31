import axios from 'axios';
import React, { useEffect, useState } from 'react'
import HeaderComponent from '../../components/header/HeaderComponent';
import { Product } from '../../interfaces/product';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import './HomeScreen.scss'
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// import { Alert, AlertTitle } from '@material-ui/lab';

import Button from '@material-ui/core/Button';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,

    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            textAlign: 'center',
        },
    }),
);


const HomeScreen = () => {
    const array: any[] = [];
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [products, setProducts] = useState([]);
    const [countCart, setCountCart] = useState<number>(0);
    const [priceCart, setPriceCart] = useState<number>(0);
    const [previewDetail, setPreviewDetail] = useState<boolean>(false);
    const [shopingCart, setShopingCart] = useState<Product[]>([]);
    const [productDetail, setProductDetail] = useState<Product>({ description: '', title: '', id: 0, image: '', price: 0 });

    useEffect(() => {
        axios.get('https://fakestoreapi.com/products').then(response => {
            setProducts(response.data)
        })
    }, [])

    const handleOpen = (id: number) => {

        console.log(id)
        axios.get(`https://fakestoreapi.com/products/${id}`, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(response => {
            console.log('productdetail', response.data)
            setProductDetail(response.data)
        })
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);

    };

    const addToCart = (product: Product) => {
        setCountCart(countCart + 1);
        setShopingCart(items => ([...items, {
            description: product.description,
            image: product.image,
            id: product.id,
            price: product.price,
            title: product.title,
        }]))
        setPriceCart(priceCart + product.price)
    }
    const deleteCart = (product: Product) => {
        for (let i = 0; i < shopingCart.length; i++) {
            if (shopingCart[i].id === product.id) {
                shopingCart.splice(i, 1)
                console.log('shopingcartttt', shopingCart);
                setCountCart(countCart - 1);
                setPriceCart(priceCart - product.price);
            }
        }
    }

    return (
        <>
            <HeaderComponent badge={countCart} totalPrice={priceCart} />
            <div className="container">

                {
                    (products) && products.map((product: Product) => {
                        return (
                            <Card key={product.id} className="container__card">
                                <CardMedia
                                    component="img"
                                    alt="Contemplative Reptile"
                                    height="40%"
                                    image={product.image}
                                    title="Contemplative Reptile"
                                />
                                <CardContent>
                                    <p className="title" > {product.title.substr(0, 20)}</p>
                                    <p className="subtitle"> {product.description.substr(0, 100)}</p>
                                    <p className="price"> <span> S/</span> {product.price}</p>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => { handleOpen(product.id) }} variant="contained" color="primary"> Vista </Button>
                                    {
                                        (shopingCart.find(element => element.id === product.id)) ? <Button size="small" onClick={() => { deleteCart(product) }} variant="contained" color="primary"> Eliminar</Button> :

                                            <Button size="small" onClick={() => { addToCart(product) }} variant="contained" color="primary"> Agregar</Button>
                                    }
                                </CardActions>
                            </Card>
                        )
                    })

                }

            </div>
            {/* <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                This is a success alert — <strong>check it out!</strong>
            </Alert> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {
                    (productDetail) &&
                    <div style={modalStyle} className={classes.paper}>
                        <img src={productDetail.image} style={{ width: '20%' }} />
                        <p> {productDetail.title}</p>
                        <p className="subtitle"> {productDetail.description}</p>
                        <p> <span> S/</span> {productDetail.price}</p>
                        {
                            (shopingCart.find(element => element.id === productDetail.id)) ? <Button size="small" onClick={() => { deleteCart(productDetail) }} variant="contained" color="primary"> Eliminar</Button> :
                                <Button size="small" onClick={() => { addToCart(productDetail) }} variant="contained" color="primary"> Agregar</Button>
                        }
                    </div>
                }
            </Modal>
        </>
    )
}

export default HomeScreen;