import axios from 'axios';
import React, { useEffect, useState } from 'react'
import HeaderComponent from '../../components/header/HeaderComponent';
import { Product } from '../../interfaces/product';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import './HomeScreen.scss'
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import URL_API from '../../config/api';
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
        root: {
            display: 'flex',
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
        },
    }),
);


const HomeScreen = () => {
    const array: any[] = [];
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [countCart, setCountCart] = useState<number>(0);
    const [priceCart, setPriceCart] = useState<number>(0);
    const [previewDetail, setPreviewDetail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [shopingCart, setShopingCart] = useState<Product[]>([]);
    const [productDetail, setProductDetail] = useState<Product>({ description: '', title: '', id: 0, image: '', price: 0 });

    useEffect(() => {
        setLoading(true)
        axios.get(`${URL_API}`).then(response => {
            setLoading(false);
            setProducts(response.data)
        })
    }, [])

    const handleOpen = (id: number) => {

        setLoadingModal(true)
        axios.get(`${URL_API}/${id}`, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(response => {
            setLoadingModal(false)
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
            {
                (loading) && <div className="container__loading">
                    <CircularProgress />
                </div>
            }
            <div className="container">

                {
                    (products) && products.map((product: Product) => {
                        return (
                            <Card key={product.id} className="container__card">
                                <CardMedia
                                    component="img"
                                    alt="Contemplative Reptile"
                                    height="30%"
                                    image={product.image}
                                    title="Contemplative Reptile"
                                />
                                <CardContent>
                                    <div >
                                        <p className="title" > {product.title.substr(0, 20)}</p>
                                        <p className="subtitle"> {product.description.substr(0, 70)}</p>
                                        <p className="price"> <span> S/</span> {product.price}</p>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => { handleOpen(product.id) }} variant="contained" color="inherit"> Vista </Button>
                                    {
                                        (shopingCart.find(element => element.id === product.id)) ? <Button size="small" onClick={() => { deleteCart(product) }} variant="contained" color="secondary"> Eliminar</Button> :

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
                <>
                    {

                    }
                    {
                        (productDetail) &&
                        <div style={modalStyle} className={classes.paper}>
                            {(loadingModal) &&
                                <CircularProgress />
                            }
                            {
                                (productDetail.id != 0) && <>
                                    <img src={productDetail.image} style={{ width: '20%' }} />
                                    <p> {productDetail.title}</p>
                                    <p className="subtitle"> {productDetail.description}</p>
                                    <p> Producto recomendado </p>
                                    <p> <span> S/</span> {productDetail.price}</p>
                                    {
                                        (shopingCart.find(element => element.id === productDetail.id)) ? <Button size="small" onClick={() => { deleteCart(productDetail) }} variant="contained" color="secondary"> Eliminar</Button> :
                                            <Button size="small" onClick={() => { addToCart(productDetail) }} variant="contained" color="primary"> Agregar</Button>
                                    }
                                </>
                            }

                        </div>
                    }
                </>
            </Modal>
        </>
    )
}

export default HomeScreen;