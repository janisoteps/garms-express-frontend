// OutfitPage.jsx
import React from "react";
import AddOutfit from '../../wardrobe/AddOutfit';
import {Route} from 'react-router-dom';
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


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
    }
    componentDidMount() {
        const queryString = window.location.search;
        if(queryString.length > 0) {
            const prodId = window.location.search.split('id=')[1];
            this.setState({
                prodId: prodId
            });

            fetch(`${window.location.origin}/api/get_products`, {
                method: 'post',
                body: JSON.stringify({'prod_hashes': [prodId]}),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                return response.json();
            }).then(data => {
                const prod_data = data[0];
                this.setState({
                    prodData: prod_data[0],
                    shownImg: prod_data[0].image_urls[0],
                    shownImgHash: prod_data[0].image_hash[0]
                })
            });
        }
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions();
    }

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

    render () {

        const sideImages = this.state.prodData !== null ? this.state.prodData.image_urls.map(sideImgUrl => {
            return (
                <div
                    style={{
                        width: '180px',
                        display: 'inline-block'
                    }}
                    key={sideImgUrl}
                >
                    <img
                        style={{
                            width: '100%',
                            height: 'auto',
                            border: sideImgUrl === this.state.shownImg ? '3px solid rgba(0, 0, 0, 1)' : '',
                            cursor: 'pointer'
                        }}
                        src={sideImgUrl}
                        onClick={() => {this.changeShownImg(sideImgUrl)}}
                    />
                </div>
            )
        }) : null;

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
                                src={imgUrl}
                                onClick={() => {this.changeShownImg(imgUrl)}}
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
                                height: `calc(100% / ${this.state.prodData.image_urls.length})`,
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
                                src={imgUrl}
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
                <div>
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
                        style={{
                            width: '100vw',
                            maxWidth: '550px',
                            height: 'auto',
                            margin: '0 auto'
                        }}
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
                <div>
                    {(this.state.isAuth === "true") ? (
                        <div
                            style={{
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '180px',
                                borderRadius: '10px',
                                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                padding: '5px',
                                display: 'inline-block',
                                margin: '5px',
                                marginRight: 'calc(50vw - 98px)',
                                marginLeft: 'calc(50vw - 98px)'
                            }}
                            onClick={() => { this.showAddOutfit(this.state.shownImgHash) }}
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
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '180px',
                                    margin: '5px',
                                    marginRight: 'calc(50vw - 98px)',
                                    marginLeft: 'calc(50vw - 98px)',
                                    borderRadius: '10px',
                                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                    padding: '5px',
                                    display: 'inline-block'
                                }}
                                onClick={() => {
                                    history.push(`/register-from-result?id=${this.state.shownImgHash}`)
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
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '180px',
                                margin: '5px',
                                marginRight: 'calc(50vw - 98px)',
                                marginLeft: 'calc(50vw - 98px)',
                                borderRadius: '10px',
                                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                padding: '5px',
                                display: 'inline-block'
                            }}
                            onClick={() => {
                                history.push(`/search-from-id?id=${this.state.shownImgHash}`)
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
                            height: '40px',
                            verticalAlign: 'middle',
                            cursor: 'pointer',
                            width: '180px',
                            margin: '5px',
                            marginRight: 'calc(50vw - 98px)',
                            marginLeft: 'calc(50vw - 98px)',
                            borderRadius: '10px',
                            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                            padding: '5px',
                            display: 'inline-block'
                        }}
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Fashion item found on Garms',
                                    url: window.location.href
                                }).then(() => {
                                    console.log('Thanks for sharing!');
                                }).catch(console.error);
                            } else {
                                console.log('fallback')
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
                    >
                        <div
                            style={{
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '180px',
                                margin: '5px',
                                marginRight: 'calc(50vw - 98px)',
                                marginLeft: 'calc(50vw - 98px)',
                                borderRadius: '10px',
                                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                padding: '5px',
                                display: 'inline-block'
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
                <div>
                    {(this.state.isAuth === "true") ? (
                        <div
                            style={{width: '100%'}}
                        >
                            <div
                                style={{
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '200px',
                                    borderRadius: '10px',
                                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                    padding: '5px',
                                    display: 'inline-block',
                                    margin: '5px',
                                    // marginRight: 'calc(50vw - 98px)',
                                    // marginLeft: 'calc(50vw - 98px)'
                                }}
                                onClick={() => { this.showAddOutfit(this.state.shownImgHash) }}
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
                            style={{width: '100%'}}
                        >
                            <Route render={({history}) => (
                                <div
                                    style={{
                                        height: '40px',
                                        verticalAlign: 'middle',
                                        cursor: 'pointer',
                                        width: '200px',
                                        margin: '5px',
                                        // marginRight: 'calc(50vw - 98px)',
                                        // marginLeft: 'calc(50vw - 98px)',
                                        borderRadius: '10px',
                                        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                        padding: '5px',
                                        display: 'inline-block'
                                    }}
                                    onClick={() => {
                                        history.push(`/register-from-result?id=${this.state.shownImgHash}`)
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
                        style={{width: '100%'}}
                    >
                        <Route render={({history}) => (
                            <div
                                style={{
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '200px',
                                    margin: '5px',
                                    // marginRight: 'calc(50vw - 98px)',
                                    // marginLeft: 'calc(50vw - 98px)',
                                    borderRadius: '10px',
                                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                    padding: '5px',
                                    display: 'inline-block'
                                }}
                                onClick={() => {
                                    history.push(`/search-from-id?id=${this.state.shownImgHash}`)
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
                        style={{width: '100%'}}
                    >
                        <div
                            style={{
                                height: '40px',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                width: '200px',
                                margin: '5px',
                                // marginRight: 'calc(50vw - 98px)',
                                // marginLeft: 'calc(50vw - 98px)',
                                borderRadius: '10px',
                                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                padding: '5px',
                                display: 'inline-block'
                            }}
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Fashion item found on Garms',
                                        url: window.location.href
                                    }).then(() => {
                                        console.log('Thanks for sharing!');
                                    }).catch(console.error);
                                } else {
                                    console.log('fallback')
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
                        style={{width: '100%'}}
                    >
                        <a
                            href={this.state.prodData.prod_url}
                            target="_blank"
                        >
                            <div
                                style={{
                                    height: '40px',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    width: '200px',
                                    margin: '5px',
                                    // marginRight: 'calc(50vw - 98px)',
                                    // marginLeft: 'calc(50vw - 98px)',
                                    borderRadius: '10px',
                                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                                    padding: '5px',
                                    display: 'inline-block'
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
                                        // marginTop: '5px'
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
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 6fr 4fr',
                        gridTemplateRows: '8fr',
                        gridColumnGap: '0px',
                        gridRowGap: '0px'
                    }}
                >
                    <div>
                        <SideImagesDesktop />
                    </div>
                    <div>
                        <MainProdImg />
                    </div>
                    <div
                        style={{
                            textAlign: 'left'
                        }}
                    >
                        <NameDescription />
                        <SizeStockDesktop />
                        <ActionButtonsDesktop />
                    </div>
                </div>
            )
        };

        const OutfitDetailsMobile = () => {
            return (
                <div
                    style={{
                        width: '100%',
                        textAlign: 'center'
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
