// OutfitPage.jsx
import React from "react";
import AddOutfit from '../../wardrobe/AddOutfit';
import {Route} from 'react-router-dom';
require('../../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import ImageSearch from "../../depracated/ImageSearch";
// import SearchFromId from "./SearchFromId";


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
                // console.log(prod_data);
                this.setState({
                    prodData: prod_data[0],
                    shownImg: prod_data[0].img_urls[0],
                    shownImgHash: prod_data[0].img_hashes[0]
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
        const imgHash = this.state.prodData.img_hashes[this.state.prodData.img_urls.indexOf(imgUrl)];
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

        const sideImages = this.state.prodData !== null ? this.state.prodData.img_urls.map(sideImgUrl => {
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

        const OutfitDetails = () => {
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
                        width: '100%'
                    }}
                >
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
                                            width: '180px',
                                            overflow: 'scroll'
                                        }}
                                    >
                                    {sideImages}
                                    </div>
                                </td>
                                <td
                                    style={{
                                        verticalAlign: 'top'
                                    }}
                                >
                                    <img
                                        src={this.state.shownImg}
                                        style={{
                                            width: 'calc(80vw - 200px)',
                                            maxWidth: '550px',
                                            height: 'auto'
                                        }}
                                    />
                                </td>
                                <td
                                    style={{
                                        verticalAlign: 'top',
                                        paddingLeft: '15px'
                                    }}
                                >
                                    <h1>{this.state.prodData.name}</h1>
                                    <h3>By {this.state.prodData.brand} in {this.state.prodData.shop}</h3>
                                    <br/>
                                    <div
                                        style={{
                                            height: '25px'
                                        }}
                                    >
                                        <h3
                                            style={{
                                                display: 'inline-block'
                                            }}
                                        >Price </h3>
                                        <div style={priceStyle}>
                                            <h3>{this.state.prodData.currency}{this.state.prodData.price}</h3>
                                        </div>
                                        {this.state.prodData.sale && (
                                            <div style={{
                                                color: '#d6181e',
                                                display: 'inline-block',
                                                marginLeft: '10px'
                                            }}>
                                                <h3>{this.state.prodData.currency}{this.state.prodData.saleprice}</h3>
                                            </div>
                                        )}
                                    </div>
                                    <br/>
                                    <a
                                        href={this.state.prodData.prod_url}
                                        target="_blank"
                                    >
                                        <h3>Open item in shop</h3>
                                    </a>
                                    <br/>
                                    {(this.state.isAuth === "true") ? (
                                        <div
                                            style={{
                                                height: '70px',
                                                verticalAlign: 'middle',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => { this.showAddOutfit(this.state.shownImgHash) }}
                                        >
                                            <div
                                                className="add-to-favorites-outfit-page"
                                            />
                                            <h4
                                                style={{
                                                    display: 'inline-block',
                                                    marginLeft: '10px',
                                                    position: 'absolute',
                                                    marginTop: '15px'
                                                }}
                                            >Add to wardrobe</h4>
                                        </div>
                                    ) : (
                                        <Route render={({history}) => (
                                            <div
                                                style={{
                                                    height: '70px',
                                                    verticalAlign: 'middle',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    history.push(`/register-from-result?id=${this.state.shownImgHash}`)
                                                }}
                                            >
                                                <div
                                                    className="add-to-favorites-outfit-page"
                                                />
                                                <h4
                                                    style={{
                                                        display: 'inline-block',
                                                        marginLeft: '10px',
                                                        position: 'absolute',
                                                        marginTop: '15px'
                                                    }}
                                                >Add to wardrobe</h4>
                                            </div>
                                        )}/>
                                    )}

                                    <Route render={({history}) => (
                                        <div
                                            style={{
                                                height: '70px',
                                                verticalAlign: 'middle',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                history.push(`/search-from-id?id=${this.state.shownImgHash}`)
                                            }}
                                        >
                                            <div
                                                className="search-similar-outfit-page"
                                            />
                                            <h4
                                                style={{
                                                    display: 'inline-block',
                                                    marginLeft: '10px',
                                                    position: 'absolute',
                                                    marginTop: '15px'
                                                }}
                                            >Search similar items</h4>
                                        </div>
                                    )}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                </div>
            )
        };

        const OutfitDetailsMobile = () => {
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
                        width: '100%',
                        textAlign: 'center'
                    }}
                >
                    <img
                        src={this.state.shownImg}
                        style={{
                            width: '90vw',
                            maxWidth: '550px',
                            height: 'auto',
                            margin: '0 auto'
                        }}
                    />
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

                            </td>
                        </tr>
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
                                    {sideImages}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{
                                    verticalAlign: 'top',
                                    paddingLeft: '15px'
                                }}
                            >
                                <br/>
                                <h1>{this.state.prodData.name}</h1>
                                <h3>By {this.state.prodData.brand} in {this.state.prodData.shop}</h3>
                                <br/>
                                <div
                                    style={{
                                        height: '25px'
                                    }}
                                >
                                    <h3
                                        style={{
                                            display: 'inline-block'
                                        }}
                                    >Price </h3>
                                    <div style={priceStyle}>
                                        <h3>{this.state.prodData.currency}{this.state.prodData.price}</h3>
                                    </div>
                                    {this.state.prodData.sale && (
                                        <div style={{
                                            color: '#d6181e',
                                            display: 'inline-block',
                                            marginLeft: '10px'
                                        }}>
                                            <h3>{this.state.prodData.currency}{this.state.prodData.saleprice}</h3>
                                        </div>
                                    )}
                                </div>
                                <br/>
                                <a
                                    href={this.state.prodData.prod_url}
                                    target="_blank"
                                >
                                    <h3>Open item in shop</h3>
                                </a>
                                <br/>
                                {(this.state.isAuth === "true") ? (
                                    <div
                                        style={{
                                            height: '70px',
                                            verticalAlign: 'middle',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => { this.showAddOutfit(this.state.shownImgHash) }}
                                    >
                                        <div
                                            className="add-to-favorites-outfit-page"
                                        />
                                        <h4
                                            style={{
                                                display: 'inline-block',
                                                marginLeft: '10px',
                                                position: 'absolute',
                                                marginTop: '15px'
                                            }}
                                        >Add to wardrobe</h4>
                                    </div>
                                ) : (
                                    <Route render={({history}) => (
                                        <div
                                            style={{
                                                height: '70px',
                                                verticalAlign: 'middle',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                history.push(`/register-from-result?id=${this.state.shownImgHash}`)
                                            }}
                                        >
                                            <div
                                                className="add-to-favorites-outfit-page"
                                            />
                                            <h4
                                                style={{
                                                    display: 'inline-block',
                                                    marginLeft: '10px',
                                                    position: 'absolute',
                                                    marginTop: '15px'
                                                }}
                                            >Add to wardrobe</h4>
                                        </div>
                                    )}/>
                                )}

                                <Route render={({history}) => (
                                    <div
                                        style={{
                                            height: '70px',
                                            verticalAlign: 'middle',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            history.push(`/search-from-id?id=${this.state.shownImgHash}`)
                                        }}
                                    >
                                        <div
                                            className="search-similar-outfit-page"
                                        />
                                        <h4
                                            style={{
                                                display: 'inline-block',
                                                marginLeft: '10px',
                                                position: 'absolute',
                                                marginTop: '15px'
                                            }}
                                        >Search similar items</h4>
                                    </div>
                                )}/>
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
                        <OutfitDetails/>
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
                                position: 'fixed'
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
