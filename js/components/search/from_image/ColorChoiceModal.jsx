// ColorChoiceModal.jsx
import React from 'react';



class ColorChoiceModal extends React.Component{
    constructor(props) {
        super(props);
        this.setColorCat = this.setColorCat.bind(this);
    }

    setColorCat(selection){
        // console.log('selection: ', selection);
        this.props.setColorPosTags(selection);
    }

    colorCatImageSearch(){
        this.props.colorCatImageSearch();
    }

    render () {
        // Dynamic CSS for image color choice modal
        if(Object.keys(this.props.colors).length > 0){
            // console.log('Selected colors: ', this.props.selectedColors);
            // console.log('Color 1: ', this.props.colors.color_1);
            // console.log('Selected color 1: ', this.props.selectedColors[0]);
            // console.log('Colors same: ', this.props.selectedColors[0] === this.props.colors.color_1);
            var colorStyle1 = {
                width: '70px',
                height: '70px',
                borderRadius: '30px',
                backgroundColor: this.props.colors.color_1_hex,
                margin: '10px',
                display: 'inline-block',
                cursor: 'pointer',
                borderWidth:
                    this.props.selectedColors[0] === this.props.colors.color_1
                        ? ('5px') : (this.props.selectedColors[1] === this.props.colors.color_1 && '5px'),
                borderColor:
                    this.props.selectedColors[0] === this.props.colors.color_1
                        ? ('#7f649c') : (this.props.selectedColors[1] === this.props.colors.color_1 && '#7f649c'),
                borderStyle:
                    this.props.selectedColors[0] === this.props.colors.color_1
                        ? ('solid') : (this.props.selectedColors[1] === this.props.colors.color_1 && 'solid')
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
                    this.props.selectedColors[0] === this.props.colors.color_2
                ? ('5px') : (this.props.selectedColors[1] === this.props.colors.color_2 && '5px'),
                borderColor:
                    this.props.selectedColors[0] === this.props.colors.color_2
                        ? ('#7f649c') : (this.props.selectedColors[1] === this.props.colors.color_2 && '#7f649c'),
                borderStyle:
                    this.props.selectedColors[0] === this.props.colors.color_2
                        ? ('solid') : (this.props.selectedColors[1] === this.props.colors.color_2 && 'solid')
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
                    this.props.selectedColors[0] === this.props.colors.color_3
                        ? ('5px') : (this.props.selectedColors[1] === this.props.colors.color_3 && '5px'),
                borderColor:
                    this.props.selectedColors[0] === this.props.colors.color_3
                        ? ('#7f649c') : (this.props.selectedColors[1] === this.props.colors.color_3 && '#7f649c'),
                borderStyle:
                    this.props.selectedColors[0] === this.props.colors.color_3
                        ? ('solid') : (this.props.selectedColors[1] === this.props.colors.color_3 && 'solid')
            };
        }

        // if colors are set in state show choice modal to select one main color
        // stateless component
        let ColorChoiceModal = () => {
            if(Object.keys(this.props.colors).length > 0){
                // console.log('Props posTags: ', this.props.tags);
                // console.log('Type of posTags: ', typeof this.props.tags);
                let catClass = (cat) => {
                    if(this.props.tags.includes(cat)){
                        return 'cat-choice-main'
                    } else {
                        return 'cat-choice'
                    }
                    // console.log('posTags: ', this.props.posTags);
                    // return this.props.posTags.includes(cat) ? 'cat-choice-main': 'cat-choice'
                };

                let mainCats = this.props.cats.map((cat, index) => {
                    return(
                        <div key={index} className={catClass(cat)} onClick={() => this.setColorCat({'cat': cat})} >{cat}</div>
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
                            <h5>I found these colors and themes in your photo</h5>
                            <br/>
                            <p>choose which color to search for:</p>
                            <div style={colorStyle1} onClick={() => this.setColorCat({'color_rgb': this.props.colors.color_1, 'cat':''})} />
                            <div style={colorStyle2} onClick={() => this.setColorCat({'color_rgb': this.props.colors.color_2, 'cat':''})} />
                            <div style={colorStyle3} onClick={() => this.setColorCat({'color_rgb': this.props.colors.color_3, 'cat':''})} />
                            <br/>
                            <br/>
                            <p>choose which tags to search for:</p>
                            <div className="main-cat-selection">
                                {mainCats}
                            </div>
                            <br/>
                            <div className="colorcat-search-button" onClick={() => this.colorCatImageSearch() } >search</div>
                        </div>
                    )
                } else {
                    return(
                        <div className="overlay">
                            <Paper zDepth={1} className="color-modal">
                                <h3>Can't recognize the outfit, try a better quality photo</h3>
                                <RaisedButton className="ok-button" label="OK" onClick={() => { window.location.reload(); }} />
                            </Paper>
                        </div>
                    )
                }

            } else {
                return(
                    ''
                )
            }
        };
        return (
            <ColorChoiceModal/>
        )
    }
}

export default ColorChoiceModal;
