// RecommendFromTags.jsx
import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';


class RecommendFromTags extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            sex: this.props.sex,
            lookFilter: this.props.lookFilter,
            outfits: []
        };

        this.showAddOutfit = this.showAddOutfit.bind(this);
    }

    componentDidMount() {
        fetch(`${window.location.origin}/api/recommend_tags`, {
            method: 'post',
            body: JSON.stringify({'email': this.state.email, 'sex': this.state.sex}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            // console.log(data);
            this.setState({
                outfits: data
            })
        })
    }

    showAddOutfit(imgHash) {
        this.props.showAddOutfit(imgHash);
    }

    render() {
        const outfitTiles = this.state.outfits.map(lookDict => {
            const lookName = lookDict.look_name;
            const suggestionArr = lookDict.prod_suggestions;

            return suggestionArr.map(prodSuggestionArr => {
                const prodSuggestion = prodSuggestionArr[0];
                const key = prodSuggestion.prod_hash;
                const priceStyle = prodSuggestion.sale ? {
                    textDecoration: 'line-through'
                } : {
                    textDecoration: 'none'
                };
                const imgHash = prodSuggestion.img_hashes[0];

                if (this.props.lookFilter === null || this.props.lookFilter === lookName) {
                    return (
                        <Paper zDepth={1} className="product-tile" key={key}>
                            <h5>Recommended in {lookName.toUpperCase()}</h5>
                            <br />
                            <div className="product-name"><h4>{prodSuggestion.name}</h4></div>
                            <div style={priceStyle}>
                                <h5>{prodSuggestion.currency}{prodSuggestion.price}</h5>
                            </div>
                            {(prodSuggestion.sale) && (
                                <div style={{color: '#d6181e'}}>
                                    <h5>{prodSuggestion.currency}{prodSuggestion.saleprice}</h5>
                                </div>
                            )}
                            <img className="product-image" src={prodSuggestion.img_url} />
                            <div className="add-to-favorites-wardrobe" onClick={() => { this.showAddOutfit(imgHash) }} />
                            <br />
                            <h3>{prodSuggestion.brand}</h3>
                            <p>From {prodSuggestion.shop}</p>
                        </Paper>
                    )
                }
            })
        });
        const tilesOrLoading = (
            <div>
                {(this.state.outfits.length > 0) ? (
                    <div>
                        <br />
                        <br />
                        <hr />
                        <h1>Recommended</h1>
                        <br />
                        <br />
                        <br />
                        {outfitTiles}
                    </div>
                ) : (
                    <h4>Loading...</h4>
                )}
            </div>
        );

        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        {(this.state.outfits.length > 0) && (
                            tilesOrLoading
                        )}
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default RecommendFromTags;
