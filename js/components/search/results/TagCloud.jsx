// TagCloud.jsx
import React from 'react';
require('../../../../css/garms.css');
import Tooltip from '@material-ui/core/Tooltip';
import TextField from "material-ui/TextField";

const kind_cats = [
    'accessories',
    'activewear',
    'backpack',
    'bag',
    'bags',
    'beachwear',
    'beauty',
    'belt',
    'bikini',
    'blazer',
    'blazers',
    'blouse',
    'blouses',
    'bodycon',
    'bodysuit',
    'boot',
    'boots',
    'bottom',
    'bottoms',
    'bra',
    'bracelet',
    'bralet',
    'bralette',
    'bras',
    'brief',
    'briefs',
    'brogues',
    'cami',
    'camis',
    'cardigan',
    'cardigans',
    'chinos',
    'clutch',
    'coat',
    'coats',
    'corset',
    'dress',
    'dresses',
    'dungaree',
    'dungarees',
    'earrings',
    'espadrille',
    'espadrilles',
    'hat',
    'heel',
    'heels',
    'hoodie',
    'hoodies',
    'jacket',
    'jackets',
    'jean',
    'jeans',
    'jeggings',
    'jersey',
    'jewellery',
    'jogger',
    'joggers',
    'jumper',
    'jumpers',
    'jumpsuit',
    'jumpsuits',
    'kimono',
    'knickers',
    'legging',
    'leggings',
    'lingerie',
    'lipstick',
    'loafers',
    'makeup',
    'mules',
    'necklace',
    'nightwear',
    'pant',
    'pants',
    'parka',
    'playsuit',
    'playsuits',
    'polo',
    'pullover',
    'pyjama',
    'ring',
    'sandal',
    'sandals',
    'scarf',
    'shirt',
    'shirts',
    'shoes',
    'shorts',
    'skirt',
    'skirts',
    'sneakers',
    'sock',
    'socks',
    'suit',
    'suits',
    'sundress',
    'sunglasses',
    'sweater',
    'sweatpant',
    'sweatpants',
    'sweatshirt',
    'sweatshirts',
    'swim',
    'swimming',
    'swimsuit',
    'swimwear',
    't-shirt',
    't-shirts',
    'tee',
    'thong',
    'tie',
    'tights',
    'top',
    'tops',
    'tote',
    'tracksuit',
    'tracksuits',
    'trainer',
    'trainers',
    'trouser',
    'trousers',
    'trunks',
    'tuxedo',
    'underwear',
    'vest',
    'vests',
    'waistcoat',
    'watch',
    'watches',
    'windbreaker',
    'workwear'
];
const color_pattern_cats = [
    'abstract',
    'acid',
    'animal',
    'apricot',
    'beige',
    'black',
    'blue',
    'bright',
    'brown',
    'burgundy',
    'cable',
    'camo',
    'charcoal',
    'check',
    'chevron',
    'circle',
    'clear',
    'contrast',
    'cream',
    'crochet',
    'dark',
    'dot',
    'dye',
    'embellished',
    'embellishment',
    'embroidered',
    'embroidery',
    'floral',
    'flower',
    'gingham',
    'gold',
    'green',
    'grey',
    'heart',
    'indigo',
    'jacquard',
    'khaki',
    'knot',
    'lace',
    'lattice',
    'leopard',
    'lettuce',
    'light',
    'lilac',
    'lime',
    'logo',
    'mango',
    'mesh',
    'monochrome',
    'mustard',
    'navy',
    'neon',
    'nude',
    'ombre',
    'orange',
    'paisley',
    'pale',
    'palm',
    'pattern',
    'peach',
    'pink',
    'pinstripe',
    'polka',
    'print',
    'printed',
    'purple',
    'rainbow',
    'red',
    'rib',
    'rose',
    'rust',
    'silver',
    'snake',
    'spot',
    'square',
    'star',
    'stitch',
    'straw',
    'stripe',
    'striped',
    'stripes',
    'tan',
    'tea',
    'textured',
    'tiger',
    'tortoiseshell',
    'triangle',
    'tropical',
    'vanilla',
    'wash',
    'washed',
    'white',
    'yellow',
    'zebra'
];
const style_cats = [
    'asymmetric',
    'bandeau',
    'bardot',
    'basic',
    'beach',
    'biker',
    'body',
    'bomber',
    'boxy',
    'boyfriend',
    'bridal',
    'broderie',
    'cargo',
    'casual',
    'chelsea',
    'chunky',
    'classic',
    'club',
    'cord',
    'crop',
    'cropped',
    'cross',
    'curve',
    'curved',
    'curves',
    'ditsy',
    'festival',
    'flare',
    'flared',
    'flat',
    'fluffy',
    'formal',
    'french',
    'fringe',
    'glamorous',
    'gym',
    'high',
    'homme',
    'large',
    'long',
    'longline',
    'loose',
    'lounge',
    'low',
    'mamalicious',
    'maternity',
    'maxi',
    'mela',
    'midi',
    'mini',
    'mom',
    'muscle',
    'oversized',
    'oxford',
    'pencil',
    'peplum',
    'petite',
    'pinafore',
    'platform',
    'pleated',
    'plunge',
    'plus',
    'push-up',
    'quilted',
    'raw',
    'regular',
    'relaxed',
    'retro',
    'ribbed',
    'ripped',
    'ruched',
    'running',
    'shirred',
    'short',
    'skater',
    'skinny',
    'sleeveless',
    'slim',
    'slinky',
    'slip',
    'smart',
    'south',
    'sports',
    'sporty',
    'stiletto',
    'straight',
    'strappy',
    'tailored',
    'tall',
    'tank',
    'tapered',
    'track',
    'training',
    'trench',
    'unisex',
    'vintage',
    'wedding',
    'western',
    'wide',
    'wrap'
];
const material_cats = [
    'beaded',
    'chiffon',
    'chino',
    'cotton',
    'denim',
    'down',
    'faux',
    'fishnet',
    'flannel',
    'glitter',
    'knit',
    'knitted',
    'leather',
    'linen',
    'merino',
    'metal',
    'metallic',
    'nylon',
    'paper',
    'pearl',
    'poplin',
    'puffer',
    'satin',
    'sequin',
    'studded',
    'suede',
    'suedette',
    'twill',
    'velour',
    'velvet',
    'viscose',
    'wool',
    'woven'
];
const attribute_cats = [
    'ankle',
    'back',
    'backless',
    'belted',
    'block',
    'bow',
    'buckle',
    'bust',
    'button',
    'buttons',
    'cameo',
    'cap',
    'chain',
    'collar',
    'crinkle',
    'cup',
    'double',
    'frill',
    'heeled',
    'hem',
    'hood',
    'hooded',
    'insert',
    'knee',
    'leg',
    'mid',
    'neck',
    'open',
    'pack',
    'padded',
    'panel',
    'panelled',
    'pocket',
    'pockets',
    'ruffle',
    'shoulder',
    'sleeve',
    'sleeves',
    'soft',
    'strap',
    'straps',
    'stretch',
    'sweat',
    'tassel',
    'trim',
    'turtle',
    'turtleneck',
    'twist',
    'underwire',
    'underwired',
    'up',
    'v-neck',
    'waist',
    'waistband',
    'waisted',
    'zip'
];
const filter_cats = [
    'curve',
    'curved',
    'curves',
    'tall',
    'plus',
    'petite',
    'mom',
    'mamalicious',
    'maternity',
    'bridal',
];
const all_cats = kind_cats.concat(color_pattern_cats).concat(style_cats).concat(material_cats).concat(attribute_cats).concat(filter_cats);


class TagCloud extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            suggestedTags: null
        };
        this.removeTag = this.removeTag.bind(this);
        this.getUniqueArr = this.getUniqueArr.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.setState({
                searchString: ''
            });
            this.props.addBrandFilter(this.state.searchString, false);
        }
    };

    //Handle text input change
    handleTextInputChange(event) {
        let value =  event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    removeTag(tag, type) {
        this.props.setTags(tag, type, 'remove');
    }

    getUniqueArr(value, index, self) {
        return self.indexOf(value) === index;
    }

    render() {
        let posTags = this.props.posTags.filter(this.getUniqueArr).map(tag => {
            return (
                <div key={tag}>
                    <div
                        // onClick={() => {this.removeTag(tag, 'positive')}}
                    >
                        <div>
                            {tag.toUpperCase()}
                        </div>
                    </div>
                </div>
            )
        });

        let negTags = this.props.negTags.map(tag => {
            return (
                <div key={tag}>
                    <div
                        // onClick={() => {this.removeTag(tag, 'negative');}}
                    >
                        <div
                            style={{
                                textDecoration: 'line-through'
                            }}
                        >
                            {tag.toUpperCase()}
                        </div>
                    </div>
                </div>
            )
        });

        const pickerTagList = this.props.posTags.map(filterTag => {
            return (
                <div key={`${filterTag}-${Math.random()}`}>
                    <Tooltip title="Remove tag">
                        <div
                            style={{
                                borderRadius: '5px',
                                border: '2px #000000 solid',
                                cursor: 'pointer',
                                width: '80vw',
                                maxWidth: '300px',
                                margin: '0 auto',
                                marginBottom: '3px'
                            }}
                            onClick={() => {this.props.addTagFilter(filterTag, null, true)}}
                        >
                            {filterTag}
                            <div className="brand-picker-bubble-minus" />
                        </div>
                    </Tooltip>
                </div>
            )
        });
        const pickerNegTagList = this.props.negTags.map(filterTag => {
            return (
                <div key={`${filterTag}-${Math.random()}`}>
                    <Tooltip title="Remove tag">
                        <div
                            style={{
                                borderRadius: '5px',
                                border: '2px #000000 solid',
                                cursor: 'pointer',
                                width: '80vw',
                                maxWidth: '300px',
                                margin: '0 auto',
                                marginBottom: '3px',
                                textDecoration: 'line-through'
                            }}
                            onClick={() => {this.props.addTagFilter(null, filterTag, true)}}
                        >
                            {filterTag}
                            <div className="brand-picker-bubble-minus" />
                        </div>
                    </Tooltip>
                </div>
            )
        });

        const PickerSuggestions = () => {
            const suggestTags = all_cats.filter(tag => {
                return tag.toLowerCase().indexOf(this.state.searchString) !== -1
            });
            const tagTiles = suggestTags.map(suggestTag => {
                return (
                    <div
                        key={`${suggestTag}-${Math.random()}`}
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            this.setState({
                                searchString: ''
                            }, () => {
                                this.props.addTagFilter(suggestTag, null, true);
                            });
                        }}
                    >
                        {suggestTag}
                    </div>
                )
            });

            return (
                <div>
                    {tagTiles}
                </div>
            )
        };

        return (
            <div>
                <Tooltip title="Change search tags">
                    <div
                        style={{
                            marginLeft: '10px',
                            borderRadius: '5px',
                            border: '2px rgba(1,1,1,0) solid',
                            paddingLeft: '5px',
                            paddingRight: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginTop: '10px',
                            marginBottom: '15px',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                            position: 'relative'
                        }}
                        onClick={() => {
                            this.props.showTagPicker(true)
                        }}
                    >
                        <div className="brand-picker-bubble-plus" />
                        {(this.props.posTags.length > 0 || this.props.negTags.length > 0) ? (
                            <div>
                                {posTags}
                                {negTags}
                            </div>
                        ) : (
                            <div
                                style={{
                                    height: '20px'
                                }}
                            >
                                ALL TAGS
                            </div>
                        )}
                    </div>
                </Tooltip>
                {this.props.tagPickerShown === true && (
                    <div style={{
                        position: 'fixed',
                        top: '50px',
                        left: '0',
                        height: 'calc(100vh - 50px)',
                        width: '100vw',
                        backgroundColor: '#FFFFFF',
                        zIndex: '30',
                        textAlign: 'center',
                        paddingTop: '10vh'
                    }}>
                        {this.props.posTags.length > 0 && (
                            pickerTagList
                        )}
                        {this.props.negTags.length > 0 && (
                            pickerNegTagList
                        )}
                        <TextField
                            autoFocus="autofocus"
                            className="text-search-input"
                            hintText={"Tag..."}
                            value={this.state.searchString}
                            floatingLabelText="Add tag"
                            floatingLabelStyle={{
                                color: 'black'
                            }}
                            name="searchString"
                            onChange={this.handleTextInputChange.bind(this)}
                            onKeyDown={this.onEnterPress}
                            underlineFocusStyle={{
                                borderBottom: '2px solid rgb(0, 0, 0)'
                            }}
                            underlineDisabledStyle={{
                                borderBottom: '0px solid rgb(0, 0, 0)'
                            }}
                        />
                        <div
                            onClick={() => {
                                if (this.state.searchString === '') {
                                    this.props.showTagPicker(false)
                                } else {
                                    this.props.addTagFilter(this.state.searchString, null, false)
                                }
                            }}
                            style={{
                                display: 'inline-block',
                                width: '90px',
                                cursor: 'pointer',
                                height: '30px',
                                marginLeft: '20px',
                                color: '#FFFFFF',
                                backgroundColor: '#000000',
                                borderRadius: '3px'
                            }}
                        >
                            OK
                        </div>

                        <div style={{
                            marginTop: '30px'
                        }}>
                            {this.state.searchString !== '' && (<PickerSuggestions />)}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default TagCloud;
