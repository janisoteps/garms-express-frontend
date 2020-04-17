import React from "react";
import InfiniteSpinner from "../loading/InfiniteSpinner";


class OnboardingOutfitPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            outfits: [],
            loadedProdIds: [],
            chosenOutfits: [],
            completed: false
        }
        this.getHeartIcon = this.getHeartIcon.bind(this);
        this.updateImgProtocol = this.updateImgProtocol.bind(this);
        this.loadNewOutfits = this.loadNewOutfits.bind(this);
    }

    componentDidMount() {
        this._ismounted = true;
        fetch(`${window.location.origin}/api/recommend_onboarding`, {
            method: 'post',
            body: JSON.stringify({
                'sex': this.props.sex
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            const loadedProdIds = data.prod_suggestions.map(resDict => {
                return resDict.prod_id
            });
            this.setState({
                outfits: data.prod_suggestions,
                loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds)
            });
        })
    }

    componentDidUpdate(prevProps){
        if (this._ismounted) {
            if(prevProps.sex !== this.props.sex){
                this.loadNewOutfits()
            }
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    loadNewOutfits() {
        this.setState({
            outfits: []
        })
        fetch(`${window.location.origin}/api/recommend_onboarding`, {
            method: 'post',
            body: JSON.stringify({
                'sex': this.props.sex
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            const loadedProdIds = data.prod_suggestions.map(resDict => {
                return resDict.prod_id
            });
            this.setState({
                outfits: data.prod_suggestions,
                loadedProdIds: this.state.loadedProdIds.concat(loadedProdIds)
            });
        })
    }

    updateImgProtocol(imgUrl) {
        if (imgUrl.split('https').length > 1) {
            return imgUrl
        } else {
            return imgUrl.replace('http', 'https')
        }
    }

    getHeartIcon() {
        const path = 'M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.' +
            '5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139' +
            '.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5' +
            '-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 ' +
            '55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33' +
            '.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99' +
            '.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.' +
            '7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 10' +
            '1.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 ' +
            '20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z';
        return (
            <svg
                width="1em"
                height="1em"
                fill="currentColor"
                viewBox="0 0 1024 1024"
                style={{ verticalAlign: '-.125em' }}
            >
                <path d={path} />
            </svg>
        );
    }

    render() {

        const StepsProgress = () => {
            const steps = [1, 2, 3, 4, 5].map(step => {
                return (
                    <div
                        key={step}
                        style={{
                            display: 'inline-block',
                            width: '30px',
                            height: '30px',
                            margin: '10px'
                        }}
                    >
                        {step < this.state.currentStep ? (
                            <div

                            >
                                {this.getHeartIcon()}
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: '1px solid black',
                                    borderRadius: '50%'
                                }}
                            >
                                {step}
                            </div>
                        )}
                    </div>
                )
            });
            return (
                <div
                    style={{
                        width: '100%',
                        height: '50px'
                    }}
                >
                    {steps}
                </div>
            )
        }

        const outfitCard = (prodSuggestion) => {
            const key = prodSuggestion.prod_id;
            const priceStyle = prodSuggestion.sale ? {
                textDecoration: 'line-through',
                display: 'inline-block'
            } : {
                textDecoration: 'none'
            };
            const imgHash = prodSuggestion.image_hash[0];
            return (
                <div
                    key={key}
                    style={{
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            paddingBottom: '125%',
                            position: 'relative',
                            overflowY: 'hidden',
                            marginBottom: '5px'
                        }}
                    >
                        <img
                            src={this.updateImgProtocol(prodSuggestion.image_urls[0])}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: '#e9dcc9',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: 'auto'
                            }}
                            onClick={() => {

                            }}
                        />
                    </div>

                    <div
                        style={{
                            marginRight: '1px',
                            marginLeft: '1px',
                            fontSize: '0.8rem',
                            lineHeight: '1'
                        }}
                    >
                        <b>{prodSuggestion.brand}</b>
                        <p
                            style={{
                                marginBottom: '1px',
                                marginTop: '1px',
                                height: '35px',
                                overflowY: 'hidden'
                            }}
                        >{prodSuggestion.name}</p>

                        <div style={priceStyle}>
                            £{prodSuggestion.price}
                        </div>
                        {(prodSuggestion.sale) && (
                            <div style={{
                                color: '#d6181e',
                                display: 'inline-block',
                                marginLeft: '5px    '
                            }}>
                                £{prodSuggestion.saleprice}
                            </div>
                        )}
                    </div>

                </div>
            )
        }

        const OutfitSuggestions = () => {
            const outfitCards = this.state.outfits.map(outfit => {
                return (
                    <div
                        key={outfit[0].prod_id}
                        style={{
                            textAlign: 'center',
                            margin: '5px',
                            width: 'calc(50% - 10px)',
                            maxWidth: '200px',
                            display: 'inline-block',
                            fontSize: '0.9rem'
                        }}
                        className='onboarding-product-card'
                        onClick={() => {
                            if (this.state.currentStep === 5) {
                                this.setState({
                                    completed: true,
                                    currentStep: this.state.currentStep + 1,
                                    chosenOutfits: this.state.chosenOutfits.concat([outfit[0]]),
                                });
                            } else {
                                this.setState({
                                    chosenOutfits: this.state.chosenOutfits.concat([outfit[0]]),
                                    currentStep: this.state.currentStep + 1
                                }, () => {
                                    this.loadNewOutfits();
                                });
                            }
                        }}
                    >
                        {outfitCard(outfit[0])}
                    </div>
                )
            })
            return (
                <div>
                    {outfitCards}
                </div>
            )
        }

        const YourPicks = () => {
            const outfitCards = this.state.chosenOutfits.map(outfit => {
                return (
                    <div
                        key={outfit.prod_id}
                        style={{
                            textAlign: 'center',
                            margin: '5px',
                            width: 'calc(50% - 10px)',
                            maxWidth: '200px',
                            display: 'inline-block',
                            fontSize: '0.9rem'
                        }}
                    >
                        {outfitCard(outfit)}
                    </div>
                )
            })

            return (
                <div>
                    <p>Your Picks:</p>
                    {outfitCards}
                    <div
                        style={{
                            width: '300px',
                            marginLeft: 'calc(50vw - 150px)',
                            marginTop: '50px',
                            marginBottom: '50px'
                        }}
                    >
                        <div
                            className='onboarding-sex-button'
                            onClick={() => {
                                this.setState({
                                    completed: false,
                                    currentStep: 1,
                                    chosenOutfits: []
                                })
                                this.loadNewOutfits();
                            }}
                        >
                            RE-DO
                        </div>
                        <div
                            className='onboarding-sex-button'
                            onClick={() => {

                            }}
                        >
                            CONFIRM
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <div
                    style={{
                        width: '100%',
                        paddingTop: '50px'
                    }}
                >
                    <i>Let's find out a little bit about your preferences. Choose your favorite outfit.</i>
                    {this.state.completed === true ? (
                        <div
                            style={{
                                paddingTop: '20px'
                            }}
                        >
                            <StepsProgress />
                            <YourPicks />
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{
                                    width: '300px',
                                    marginLeft: 'calc(50vw - 150px)',
                                    marginTop: '50px',
                                    marginBottom: '5px'
                                }}
                            >
                                <div
                                    className='onboarding-sex-button'
                                    style={{
                                        backgroundColor: this.props.sex === 'women' && '#000000',
                                        color: this.props.sex === 'women' && '#FFFFFF'
                                    }}
                                    onClick={() => {
                                        this.setState({
                                            currentStep: 1,
                                            chosenOutfits: []
                                        });
                                        this.props.changeSex('women');
                                    }}
                                >
                                    HER
                                </div>
                                <div
                                    className='onboarding-sex-button'
                                    style={{
                                        backgroundColor: this.props.sex === 'men' && '#000000',
                                        color: this.props.sex === 'men' && '#FFFFFF'
                                    }}
                                    onClick={() => {
                                        this.setState({
                                            currentStep: 1,
                                            chosenOutfits: []
                                        });
                                        this.props.changeSex('men');
                                    }}
                                >
                                    HIM
                                </div>
                            </div>
                            <StepsProgress />
                            <OutfitSuggestions />
                        </div>
                    )}
                </div>
                {this.state.outfits.length === 0 && (
                    <div>
                        <br />
                        <br />
                        <InfiniteSpinner />
                        <br />
                        <br />
                    </div>
                )}
            </div>
        )
    }
}

export default OnboardingOutfitPicker;
