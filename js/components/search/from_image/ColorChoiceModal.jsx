// ColorChoiceModal.jsx
import React from 'react';
import {isMobile} from "react-device-detect";
import { SwatchesPicker } from 'react-color';
import TagPicker from './TagPicker';


class ColorChoiceModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showColorPicker: false,
            showTagPicker: false,
            cats: null,
            showNoTagWarning: false
        };
        this.setColorCat = this.setColorCat.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.addOwnCat = this.addOwnCat.bind(this);
    }

    setColorCat(selection){
        this.props.setColorPosTags(selection);
    }

    colorCatImageSearch(){
        if (this.props.tags.length > 0 && this.props.selectedColor.length > 0) {
            this.props.colorCatImageSearch();
        } else {
            this.setState({
                showNoTagWarning: true
            })
        }
    }

    handleChangeComplete = (color) => {
        if ((color.rgb['r'] + color.rgb['g'] + color.rgb['b']) < 10) {
            this.setColorCat({
                'color_rgb': [color.rgb['r'] + 10, color.rgb['g'] + 10, color.rgb['b'] +10],
                'cat':''
            });
            this.props.addOwnColor({
                'rgb': [color.rgb['r'] + 10, color.rgb['g'] + 10, color.rgb['b'] +10],
                'hex': color.hex
            })
        } else {
            this.setColorCat({
                'color_rgb': [color.rgb['r'], color.rgb['g'], color.rgb['b']],
                'cat':''
            });
            this.props.addOwnColor({
                'rgb': [color.rgb['r'], color.rgb['g'], color.rgb['b']],
                'hex': color.hex
            })
        }

        this.setState({
            showColorPicker: false
        });
    };

    addOwnCat(cat) {
        this.props.addOwnCat(cat);
        this.setColorCat({'cat': cat});
        this.setState({
            showTagPicker: false
        });
    }

    render () {

        let NewColorPicker = () => {
            if (this.state.showColorPicker) {

                let SWPicker = () => {
                    if (isMobile) {
                        return (
                            <SwatchesPicker
                                onChange={ this.handleChangeComplete }
                                width={'100%'}
                                height={'calc(100vh - 350px)'}
                            />
                        )
                    } else {
                        return (
                            <SwatchesPicker
                                onChange={ this.handleChangeComplete }
                                width={'100%'}
                                height={'calc(((1100 / 100vw) * 250)px)'}
                            />
                        )
                    }
                };

                return(
                    <div style={{
                        position: 'fixed',
                        top: '50px',
                        left: '0',
                        width: '100vw',
                        height: 'calc(100vh - 50px)',
                        backgroundColor: '#FFFFFF',
                        opacity: '0.95',
                        paddingTop: '85px',
                        textAlign: 'center',
                        zIndex: '20'
                    }}>
                        <h1 style={{marginLeft: '90px', width: 'calc(100vw - 130px)'}}>pick another color</h1>
                        <br></br>
                        <br></br>
                        <SWPicker/>
                    </div>
                )
            } else {
                return (
                    <div style={{height: '0px'}} />
                )
            }
        };

        // Dynamic CSS for image color choice modal
        if(Object.keys(this.props.colors).length > 0){
            var colorStyle1 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.props.colors.color_1_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                borderWidth:
                    this.props.selectedColor === this.props.colors.color_1
                        ? ('5px') : (this.props.selectedColor === this.props.colors.color_1 && '5px'),
                borderColor:
                    this.props.selectedColor === this.props.colors.color_1
                        ? ('#000000') : (this.props.selectedColor === this.props.colors.color_1 && '#000000'),
                borderStyle:
                    this.props.selectedColor === this.props.colors.color_1
                        ? ('solid') : (this.props.selectedColor === this.props.colors.color_1 && 'solid')
            };
            var colorStyle2 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.props.colors.color_2_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                borderWidth:
                    this.props.selectedColor === this.props.colors.color_2
                ? ('5px') : (this.props.selectedColor === this.props.colors.color_2 && '5px'),
                borderColor:
                    this.props.selectedColor === this.props.colors.color_2
                        ? ('#000000') : (this.props.selectedColor === this.props.colors.color_2 && '#000000'),
                borderStyle:
                    this.props.selectedColor === this.props.colors.color_2
                        ? ('solid') : (this.props.selectedColor === this.props.colors.color_2 && 'solid')
            };
            var colorStyle3 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.props.colors.color_3_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                borderWidth:
                    this.props.selectedColor === this.props.colors.color_3
                        ? ('5px') : (this.props.selectedColor === this.props.colors.color_3 && '5px'),
                borderColor:
                    this.props.selectedColor === this.props.colors.color_3
                        ? ('#000000') : (this.props.selectedColor === this.props.colors.color_3 && '#000000'),
                borderStyle:
                    this.props.selectedColor === this.props.colors.color_3
                        ? ('solid') : (this.props.selectedColor === this.props.colors.color_3 && 'solid')
            };
            var colorStyle4 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.props.colors.color_4_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                // border: this.props.colors.color_4 && ((this.props.colors.color_4.length === this.props.selectedColor.length
                //     && this.props.colors.color_4.every((value, index) => value === this.props.selectedColors[0][index])
                // || this.props.colors.color_4.length === this.props.selectedColors[1].length
                //     && this.props.colors.color_4.every((value, index) => value === this.props.selectedColors[1][index]))
                // ?('5px #000000 solid') : (''))
                border: this.props.colors.color_4 && ((this.props.colors.color_4.length === this.props.selectedColor.length
                    && this.props.colors.color_4.every((value, index) => value === this.props.selectedColor[index])
                    ) ? ('5px #000000 solid') : (''))
            };
        }

        // if colors are set in state show choice modal to select one main color
        // stateless component
        let ColorChoiceModal = () => {
            if(Object.keys(this.props.colors).length > 0){
                let catClass = (cat) => {
                    if(this.props.tags.includes(cat)){
                        return 'cat-choice-main'
                    } else {
                        return 'cat-choice'
                    }
                };

                let mainCats = this.props.cats.map((cat, index) => {
                    return(
                        <div
                            key={index}
                            className={catClass(cat)}
                            onClick={() => this.setColorCat({'cat': cat})}
                        >
                            {cat}
                        </div>
                    )
                });

                if(Object.keys(this.props.cats).length > 0){
                    return(
                        <div className="color-modal">
                            <div className="color-modal-image-preview">
                                {this.props.files.length > 0 ?
                                    <img className="color-image-preview" src={this.props.files[0].preview} />
                                    :
                                    <img className="color-image-preview" src={this.props.fileFromUrl.imgUrl} />
                                }
                            </div>
                            <br/>
                            <p>choose which color to search for:</p>
                            <div style={colorStyle1} onClick={() => this.setColorCat({'color_rgb': this.props.colors.color_1, 'cat':''})} />
                            <div style={colorStyle2} onClick={() => this.setColorCat({'color_rgb': this.props.colors.color_2, 'cat':''})} />
                            <div style={colorStyle3} onClick={() => this.setColorCat({'color_rgb': this.props.colors.color_3, 'cat':''})} />
                            {this.props.colors.color_4 && (
                                <div
                                    style={colorStyle4}
                                    onClick={() => this.setColorCat({
                                        'color_rgb': this.props.colors.color_4,
                                        'cat':''
                                    })}
                                />
                            )}
                            <div
                                className="palette-button"
                                onClick={() => {
                                    this.setState({
                                        showColorPicker: true
                                    })
                                }}
                            />
                            <br/>
                            <br/>
                            <p>choose which tags to search for:</p>
                            <div className="main-cat-selection">
                                {mainCats}
                                <div
                                    className='cat-choice'
                                    onClick={() => {
                                        this.setState({
                                            showTagPicker: true
                                        })
                                    }}
                                >
                                    other...
                                </div>
                            </div>
                            <br/>
                            <div className="colorcat-search-button" onClick={() => this.colorCatImageSearch() } >SEARCH</div>
                        </div>
                    )
                } else {
                    return(
                        <div className="overlay">
                            <div className="color-modal">
                                <h3>Can't recognize the outfit, try a better quality photo</h3>
                                <button className="ok-button" onClick={() => { window.location.reload(); }} >OK</button>
                            </div>
                        </div>
                    )
                }

            } else {
                return(
                    ''
                )
            }
        };

        const NoTagModalWarning = () => {
           return (
               <div
                   style={{
                       position: 'fixed',
                       top: '50px',
                       left: '0',
                       height: 'calc(100vh - 50px)',
                       width: '100vw',
                       paddingTop: '10vh',
                       textAlign: 'center',
                       zIndex: '40',
                       backgroundColor: '#FFFFFF'
                   }}
               >
                   <h1>Choose at least one tag and one color</h1>
                   <button
                       className="ok-button"
                       onClick={() => {
                           this.setState({
                               showNoTagWarning: false
                           })
                       }}
                   >OK</button>
               </div>
           )
        };

        // #################################### MAIN RENDER #####################################
        return (
            <div>
                <ColorChoiceModal/>
                <NewColorPicker />
                {this.state.showTagPicker === true && (
                    <TagPicker
                        addOwnCat={(cat) => {this.addOwnCat(cat)}}
                    />
                )}
                {this.state.showNoTagWarning === true && (
                    <NoTagModalWarning/>
                )}
            </div>
        )
    }
}

export default ColorChoiceModal;
