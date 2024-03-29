// OutfitPage.jsx
import React from "react";
import AddOutfit from '../../wardrobe/AddOutfit';
import {Route} from 'react-router-dom';
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactGA from "react-ga";


//Component to search for products using text input
class OutfitPage extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            sex: this.props.sex,
            email: this.props.email,
            prodId: null,
            prodData: null,
            shownImg: null,
            shownImgHash: null,
            imgHash: null
        };
        this.changeShownImg = this.changeShownImg.bind(this);
        this.showAddOutfit = this.showAddOutfit.bind(this);
        this.addOutfitComplete = this.addOutfitComplete.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.filterUnique = this.filterUnique.bind(this);
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        let sex = null;
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const prodId = window.location.search.split('id=')[1].split('&')[0];
            sex = window.location.search.split('sex=')[1];
            this.setState({
                prodId: prodId
            });

            fetch(`${window.location.origin}/api/get_products`, {
                method: 'post',
                body: JSON.stringify({
                    'prod_hashes': [prodId],
                    'sex': sex ? sex : this.state.sex
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                return response.json();
            }).then(data => {
                let prod_data = data[0];
                prod_data[0].image_urls = prod_data[0].image_urls.filter( this.filterUnique );
                this.setState({
                    prodData: prod_data[0],
                    shownImg: prod_data[0].image_urls[0],
                    shownImgHash: prod_data[0].image_hash[0]
                });
                window.scrollTo(0, 0);
            });
        }
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    filterUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    changeShownImg = (imgUrl) => {
        const imgHash = this.state.prodData.image_hash[this.state.prodData.image_urls.indexOf(imgUrl)];
        this.setState({
            shownImg: imgUrl,
            shownImgHash: imgHash
        });
    };

    showAddOutfit = (imgHash) => {
        this.setState({
            imgHash: imgHash
        })
    };

    addOutfitComplete = () => {
        this.setState({
            imgHash: null
        });
        window.history.replaceState(null, null, window.location.pathname);
    };

    updateImgProtocol(imgUrl) {
        if (imgUrl.split('https').length > 1) {
            return imgUrl
        } else {
            return imgUrl.replace('http', 'https')
        }
    }

    render () {
        const SideImagesMobile = () => {
            if (this.state.prodData.image_urls.length > 1) {
                const secondaryImages = this.state.prodData.image_urls.map(imgUrl => {
                    return (
                        <div
                            style={{
                                width: `calc(100% / ${this.state.prodData.image_urls.length})`,
                                display: 'inline-block'
                            }}
                            key={imgUrl}
                        >
                            <img
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    border: imgUrl === this.state.shownImg ? '3px solid rgba(0, 0, 0, 1)' : '',
                                    cursor: 'pointer'
                                }}
                                src={this.updateImgProtocol(imgUrl)}
                                onClick={() => {
                                    ReactGA.event({
                                        category: "Outfit Page",
                                        action: 'next image',
                                        label: this.state.prodData.prodId
                                    });
                                    this.changeShownImg(imgUrl)
                                }}
                            />
                        </div>
                    )
                });

                return (
                    <div
                        style={{
                            width: '100%'
                        }}
                    >
                        {secondaryImages}
                    </div>
                )
            } else {
                return (
                    <div />
                )
            }
        };

        const SideImagesDesktop = () => {
            if (this.state.prodData.image_urls.length > 1) {
                const secondaryImages = this.state.prodData.image_urls.map(imgUrl => {
                    return (
                        <div
                            style={{
                                height: `calc(80vh * (1 / ${this.state.prodData.image_urls.length}))`,
                                width: '100%',
                                display: 'inline-block'
                            }}
                            key={imgUrl}
                        >
                            <img
                                style={{
                                    height: '100%',
                                    width: 'auto',
                                    border: imgUrl === this.state.shownImg ? '3px solid rgba(0, 0, 0, 1)' : '',
                                    cursor: 'pointer'
                                }}
                                src={this.updateImgProtocol(imgUrl)}
                                onClick={() => {this.changeShownImg(imgUrl)}}
                            />
                        </div>
                    )
                });

                return (
                    <div
                        style={{
                            height: '100%'
                        }}
                    >
                        {secondaryImages}
                    </div>
                )
            } else {
                return (
                    <div />
                )
            }
        };

        const NameDescription = () => {
            const priceStyle = this.state.prodData.sale ? {
                textDecoration: 'line-through',
                display: 'inline-block',
                marginLeft: '10px'
            } : {
                textDecoration: 'none',
                display: 'inline-block',
                marginLeft: '10px'
            };

            return (
                <div
                    style={{
                        fontSize: '0.9rem',
                        lineHeight: '1'
                    }}
                >
                    <br/>
                    <h5>{this.state.prodData.name}</h5>
                    <h6>By {this.state.prodData.brand} in {this.state.prodData.shop}</h6>
                    <div
                        style={{
                            height: '25px'
                        }}
                    >
                        <h6
                            style={{
                                display: 'inline-block'
                            }}
                        >Price </h6>
                        <div style={priceStyle}>
                            <h6>£{this.state.prodData.price}</h6>
                        </div>
                        {this.state.prodData.sale && (
                            <div style={{
                                color: '#d6181e',
                                display: 'inline-block',
                                marginLeft: '10px'
                            }}>
                                <h6>£{this.state.prodData.saleprice}</h6>
                            </div>
                        )}
                    </div>
                    <br/>
                    <p
                        dangerouslySetInnerHTML={{__html: this.state.prodData.description}}
                    />
                </div>
            )
        };

        const MainProdImg = () => {
            const mainImgStyle = this.state.width > 930 ? {
                height: '80vh',
                width: 'auto',
                margin: '0 auto'
            } : {
                width: '100vw',
                maxWidth: '700px',
                height: 'auto',
                margin: '0 auto'
            };
            return (
                <div
                    style={{
                        overflow: 'hidden',
                        position: 'relative',
                        width: '100%'
                    }}
                >
                    <img
                        src={this.state.shownImg}
                        style={mainImgStyle}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            top: 0,
                            left: 0
                        }}
                    >
                        <div
                            style={{
                                width: '50%',
                                height: '100%',
                                display: 'inline-block',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                const currentImgIndex = this.state.prodData.image_urls.indexOf(this.state.shownImg);
                                let nextImgIndex = currentImgIndex - 1;
                                if(nextImgIndex < 0) {
                                    nextImgIndex = this.state.prodData.image_urls.length - 1;
                                }
                                const nextImgUrl = this.state.prodData.image_urls[nextImgIndex];
                                this.changeShownImg(nextImgUrl);
                            }}
                        >
                            <img
                                alt='Previous image'
                                src={require('./../../../../images/baseline_keyboard_arrow_left_black_48dp.png')}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    position: 'absolute',
                                    top: 'calc(50% - 24px)',
                                    left: 0
                                }}
                            />
                        </div>
                        <div
                            style={{
                                width: '50%',
                                height: '100%',
                                display: 'inline-block',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                const currentImgIndex = this.state.prodData.image_urls.indexOf(this.state.shownImg);
                                let nextImgIndex = currentImgIndex + 1;
                                if(nextImgIndex > this.state.prodData.image_urls.length - 1) {
                                    nextImgIndex = 0
                                }
                                const nextImgUrl = this.state.prodData.image_urls[nextImgIndex];
                                this.changeShownImg(nextImgUrl);
                            }}
                        >
                            <img
                                alt='Next image'
                                src={require('./../../../../images/baseline_keyboard_arrow_right_black_48dp.png')}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    position: 'absolute',
                                    top: 'calc(50% - 24px)',
                                    right: 0
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        };

        const ActionButtons = () => {
            return (
                <div
                    style={{
                        position: 'fixed',
                        bottom: this.props.showIosNav === true ? '80px' : 0,
                        backgroundColor: 'white',
                        left: 0,
                        width: '100vw'
                    }}
                >
                    {(this.state.isAuth === "true") ? (
                        <div
                            style={{
                                color: 'white',
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '50%',
                                padding: '5px',
                                display: 'inline-block',
                                zIndex: '10',
                                border: 'solid white 1px',
                                backgroundColor: '#000000'
                            }}
                            onClick={() => {
                                ReactGA.event({
                                    category: "Outfit Page",
                                    action: 'add outfit',
                                    label: this.state.prodData.prodId
                                });
                                this.showAddOutfit(this.state.shownImgHash);
                            }}
                        >
                            <div
                                className="add-to-favorites-outfit-page"
                            />
                            <b
                                style={{
                                    display: 'inline-block',
                                    marginLeft: '10px',
                                    position: 'absolute',
                                    marginTop: '5px'
                                }}
                            >Add to wardrobe</b>
                        </div>
                    ) : (
                        <Route render={({history}) => (
                            <div
                                style={{
                                    color: 'white',
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '50%',
                                    padding: '5px',
                                    display: 'inline-block',
                                    zIndex: '10',
                                    border: 'solid white 1px',
                                    backgroundColor: '#000000'
                                }}
                                onClick={() => {
                                    ReactGA.event({
                                        category: "Outfit Page",
                                        action: 'add outfit',
                                        label: this.state.prodData.prodId
                                    });
                                    history.push(`/register-from-result?id=${this.state.shownImgHash}`);
                                }}
                            >
                                <div
                                    className="add-to-favorites-outfit-page"
                                />
                                <b
                                    style={{
                                        display: 'inline-block',
                                        marginLeft: '10px',
                                        position: 'absolute',
                                        marginTop: '5px'
                                    }}
                                >Add to Wardrobe</b>
                            </div>
                        )}/>
                    )}

                    <Route render={({history}) => (
                        <div
                            style={{
                                color: 'white',
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '50%',
                                padding: '5px',
                                display: 'inline-block',
                                zIndex: '10',
                                border: 'solid white 1px',
                                backgroundColor: '#000000',
                                position: 'relative'
                            }}
                            onClick={() => {
                                ReactGA.event({
                                    category: "Outfit Page",
                                    action: 'search similar',
                                    label: this.state.shownImgHash
                                });
                                // history.push(`/search-from-id?id=${this.state.shownImgHash}`)
                                history.push(`search-similar?id=${this.state.shownImgHash}&sex=${this.state.prodData.sex}`)
                            }}
                        >
                            <div
                                className="search-similar-outfit-page"
                            />
                            <b
                                style={{
                                    display: 'inline-block',
                                    marginLeft: '10px',
                                    position: 'absolute',
                                    marginTop: '5px'
                                }}
                            >Search Similar</b>
                        </div>
                    )}/>

                    <div
                        style={{
                            color: 'white',
                            height: '40px',
                            verticalAlign: 'middle',
                            cursor: 'pointer',
                            width: '50%',
                            padding: '5px',
                            display: 'inline-block',
                            zIndex: '10',
                            border: 'solid white 1px',
                            backgroundColor: '#000000',
                            position: 'relative'
                        }}
                        onClick={() => {
                            ReactGA.event({
                                category: "Outfit Page",
                                action: 'share outfit',
                                label: window.location.href
                            });
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Fashion item found on Garms',
                                    url: window.location.href
                                }).then(() => {
                                    console.log('Thanks for sharing!');
                                }).catch(console.error);
                            } else {
                                console.log('fallback');
                                console.log(window.location.href);
                                alert('This browser does not support Share feature. Please copy the URL to share this page.')
                            }
                        }}
                    >
                        <div
                            className="share-outfit-page"
                        />
                        <b
                            style={{
                                display: 'inline-block',
                                marginLeft: '10px',
                                position: 'absolute',
                                marginTop: '5px'
                            }}
                        >Share</b>
                    </div>

                    <a
                        href={this.state.prodData.prod_url}
                        target="_blank"
                        onClick={() => {
                            ReactGA.event({
                                category: "Outfit Page",
                                action: 'buy now',
                                label: this.state.prodData.prod_url,
                            });
                        }}
                    >
                        <div
                            style={{
                                color: 'white',
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '50%',
                                padding: '5px',
                                display: 'inline-block',
                                zIndex: '10',
                                border: 'solid white 1px',
                                backgroundColor: '#000000',
                                position: 'relative'
                            }}
                        >
                            <div
                                className="buy-outfit-page"
                            />
                            <b
                                style={{
                                    display: 'inline-block',
                                    marginLeft: '10px',
                                    position: 'absolute',
                                    marginTop: '5px'
                                }}
                            >Buy Now</b>
                        </div>
                    </a>

                </div>
            )
        };

        const ActionButtonsDesktop = () => {
            return (
                <div
                    style={{
                        backgroundColor: 'white',
                        width: '100%'
                    }}
                >
                    {(this.state.isAuth === "true") ? (
                        <div
                            style={{
                                display: 'inline-block',
                                width: '50%'
                            }}
                        >
                            <div
                                style={{
                                    color: 'white',
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '100%',
                                    padding: '5px',
                                    display: 'inline-block',
                                    zIndex: '10',
                                    border: 'solid white 1px',
                                    backgroundColor: '#000000'
                                }}
                                onClick={() => {
                                    ReactGA.event({
                                        category: "Outfit Page",
                                        action: 'add outfit',
                                        label: this.state.prodData.prodId
                                    });
                                    this.showAddOutfit(this.state.shownImgHash);
                                }}
                            >
                                <div
                                    className="add-to-favorites-outfit-page"
                                />
                                <b
                                    style={{
                                        display: 'inline-block',
                                        marginLeft: '10px',
                                        position: 'absolute',
                                        // marginTop: '5px'
                                    }}
                                >Add to wardrobe</b>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'inline-block',
                                width: '50%'
                            }}
                        >
                            <Route render={({history}) => (
                                <div
                                    style={{
                                        color: 'white',
                                        height: '40px',
                                        verticalAlign: 'middle',
                                        cursor: 'pointer',
                                        width: '100%',
                                        padding: '5px',
                                        display: 'inline-block',
                                        zIndex: '10',
                                        border: 'solid white 1px',
                                        backgroundColor: '#000000'
                                    }}
                                    onClick={() => {
                                        ReactGA.event({
                                            category: "Outfit Page",
                                            action: 'add outfit',
                                            label: this.state.prodData.prodId
                                        });
                                        history.push(`/register-from-result?id=${this.state.shownImgHash}`);
                                    }}
                                >
                                    <div
                                        className="add-to-favorites-outfit-page"
                                    />
                                    <b
                                        style={{
                                            display: 'inline-block',
                                            marginLeft: '10px',
                                            position: 'absolute',
                                            // marginTop: '5px'
                                        }}
                                    >Add to Wardrobe</b>
                                </div>
                            )}/>
                        </div>

                    )}

                    <div
                        style={{
                            display: 'inline-block',
                            width: '50%'
                        }}
                    >
                        <Route render={({history}) => (
                            <div
                                style={{
                                    color: 'white',
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '100%',
                                    padding: '5px',
                                    display: 'inline-block',
                                    zIndex: '10',
                                    border: 'solid white 1px',
                                    backgroundColor: '#000000'
                                }}
                                onClick={() => {
                                    ReactGA.event({
                                        category: "Outfit Page",
                                        action: 'search similar',
                                        label: this.state.shownImgHash
                                    });
                                    // history.push(`/search-from-id?id=${this.state.shownImgHash}`)
                                    history.push(`search-similar?id=${this.state.shownImgHash}&sex=${this.state.prodData.sex}`)
                                }}
                            >
                                <div
                                    className="search-similar-outfit-page"
                                />
                                <b
                                    style={{
                                        display: 'inline-block',
                                        marginLeft: '10px',
                                        position: 'absolute',
                                        // marginTop: '5px'
                                    }}
                                >Search Similar</b>
                            </div>
                        )}/>
                    </div>


                    <div
                        style={{
                            display: 'inline-block',
                            width: '50%'
                        }}
                    >
                        <div
                            style={{
                                color: 'white',
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '100%',
                                padding: '5px',
                                zIndex: '10',
                                border: 'solid white 1px',
                                backgroundColor: '#000000'
                            }}
                            onClick={() => {
                                ReactGA.event({
                                    category: "Outfit Page",
                                    action: 'share outfit',
                                    label: window.location.href
                                });
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Fashion item found on Garms',
                                        url: window.location.href
                                    }).then(() => {
                                        console.log('Thanks for sharing!');
                                    }).catch(console.error);
                                } else {
                                    console.log('fallback');
                                    console.log(window.location.href);
                                    alert('This browser does not support Share feature. Please copy the URL to share this page.');
                                }
                            }}
                        >
                            <div
                                className="share-outfit-page"
                            />
                            <b
                                style={{
                                    display: 'inline-block',
                                    marginLeft: '10px',
                                    position: 'absolute',
                                    // marginTop: '5px'
                                }}
                            >Share</b>
                        </div>
                    </div>


                    <div
                        style={{
                            display: 'inline-block',
                            width: '50%'
                        }}
                    >
                        <a
                            href={this.state.prodData.prod_url}
                            target="_blank"
                            onClick={() => {
                                ReactGA.event({
                                    category: "Outfit Page",
                                    action: 'buy now',
                                    label: this.state.prodData.prod_url,
                                });
                            }}
                        >
                            <div
                                style={{
                                    color: 'white',
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '100%',
                                    padding: '5px',
                                    display: 'inline-block',
                                    zIndex: '10',
                                    border: 'solid white 1px',
                                    backgroundColor: '#000000',
                                    marginTop: '-15px'
                                }}
                            >
                                <div
                                    className="buy-outfit-page"
                                />
                                <b
                                    style={{
                                        display: 'inline-block',
                                        marginLeft: '10px',
                                        position: 'absolute'
                                    }}
                                >Buy Now</b>
                            </div>
                        </a>
                    </div>
                </div>
            )
        };

        const SizeStock = () => {
            const sizeRows = this.state.prodData.size_stock.map(sizeDict => {
                const key = Math.random();
                return (
                    <tr key={key}>
                        <td
                            style={{
                                textAlign: 'center',
                                border: '1px rgba(0,0,0,1) solid'
                            }}
                        >
                            {sizeDict.size}
                        </td>
                        <td
                            style={{
                                textAlign: 'center',
                                border: '1px rgba(0,0,0,1) solid'
                            }}
                        >
                            {sizeDict.stock}
                        </td>
                    </tr>
                )
            });
            return (
                <div>
                    <table
                        style={{
                            margin: '0 auto',
                            marginBottom: '30px'
                        }}
                    >
                        <tbody>
                            <tr
                                style={{
                                    backgroundColor: 'rgba(0,0,0,1)',
                                    color: 'rgba(255,255,255,1)',
                                    width: '300px'
                                }}
                            >
                                <td
                                    style={{
                                        border: '1px rgba(0,0,0,1) solid'
                                    }}
                                >
                                    <h6
                                        style={{
                                            margin: '5px',
                                            marginRight: '15px',
                                            marginLeft: '15px'
                                        }}
                                    >Size</h6>
                                </td>
                                <td
                                    style={{
                                        border: '1px rgba(0,0,0,1) solid'
                                    }}
                                >
                                    <h6
                                        style={{
                                            margin: '5px',
                                            marginRight: '15px',
                                            marginLeft: '15px'
                                        }}
                                    >Availability</h6>
                                </td>
                            </tr>
                            {sizeRows}
                        </tbody>
                    </table>
                </div>
            )
        };

        const SizeStockDesktop = () => {
            const sizeRows = this.state.prodData.size_stock.map(sizeDict => {
                const key = Math.random();
                return (
                    <tr key={key}>
                        <td
                            style={{
                                textAlign: 'center',
                                border: '1px rgba(0,0,0,1) solid'
                            }}
                        >
                            {sizeDict.size}
                        </td>
                        <td
                            style={{
                                textAlign: 'center',
                                border: '1px rgba(0,0,0,1) solid'
                            }}
                        >
                            {sizeDict.stock}
                        </td>
                    </tr>
                )
            });
            return (
                <div>
                    <table
                        style={{
                            margin: '0 auto',
                            marginBottom: '10px',
                            marginLeft: '5px'
                        }}
                    >
                        <tbody>
                        <tr
                            style={{
                                backgroundColor: 'rgba(0,0,0,1)',
                                color: 'rgba(255,255,255,1)',
                                width: '300px'
                            }}
                        >
                            <td
                                style={{
                                    border: '1px rgba(0,0,0,1) solid'
                                }}
                            >
                                <h6
                                    style={{
                                        margin: '5px',
                                        marginRight: '20px',
                                        marginLeft: '20px'
                                    }}
                                >Size</h6>
                            </td>
                            <td
                                style={{
                                    border: '1px rgba(0,0,0,1) solid'
                                }}
                            >
                                <h6
                                    style={{
                                        margin: '5px',
                                        marginRight: '20px',
                                        marginLeft: '20px'
                                    }}
                                >Availability</h6>
                            </td>
                        </tr>
                        {sizeRows}
                        </tbody>
                    </table>
                </div>
            )
        };

        const OutfitDetailsDesktop = () => {
            return (
                <div
                    className="outfit-details-desktop-grid"
                >
                    <div
                        className="outfit-details-desktop-images"
                    >
                        <div
                            className="outfit-details-desktop-side-images"
                        >
                            <SideImagesDesktop />
                        </div>
                        <div
                            className="outfit-details-desktop-main-image"
                        >
                            <MainProdImg />
                        </div>
                    </div>
                    <div
                        style={{
                            textAlign: 'left'
                        }}
                        className="outfit-details-desktop-description"
                    >
                        <NameDescription />
                        <SizeStockDesktop />
                        <ActionButtonsDesktop />
                    </div>
                    <div className="outfit-details-desktop-nothing" />
                </div>
            )
        };

        const OutfitDetailsMobile = () => {
            return (
                <div
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        paddingBottom: '80px'
                    }}
                >
                    <MainProdImg />
                    <table
                        style={{
                            margin: '0 auto'
                        }}
                    >
                        <tbody>
                        <tr>
                            <td
                                style={{
                                    verticalAlign: 'top'
                                }}
                            >
                                <div
                                    style={{
                                        maxHeight: '90vh',
                                        overflow: 'scroll'
                                    }}
                                >
                                    <SideImagesMobile />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{
                                    verticalAlign: 'top',
                                    paddingLeft: '15px',
                                }}
                            >
                                <NameDescription />
                                <SizeStock />
                                <br />
                                <br />
                                <br />
                                <ActionButtons />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br/>
                </div>
            )
        };

        const ResponsiveDetails = () => {
            return (
                <div>
                    {this.state.width > 930 ? (
                        <OutfitDetailsDesktop/>
                    ) : (
                        <OutfitDetailsMobile />
                    )}
                </div>
            )
        };

        return (
            <MuiThemeProvider>
                <div>
                    {this.state.prodData !== null && (
                        <div
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <ResponsiveDetails />
                        </div>
                    )}
                    {(this.state.imgHash !== null) && (
                        <div
                            style={{
                                width: '100vw',
                                backgroundColor: 'white',
                                height: 'calc(100vh)',
                                top: '0px',
                                position: 'absolute'
                            }}
                        >
                            <AddOutfit
                                sex={this.state.sex}
                                imgHash={this.state.imgHash}
                                email={this.props.email}
                                addOutfitComplete={this.addOutfitComplete}
                            />
                        </div>
                    )}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default OutfitPage;
