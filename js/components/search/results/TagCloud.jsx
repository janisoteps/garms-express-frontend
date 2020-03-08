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
    'beachwear',
    'beanie',
    'beauty',
    'belt',
    'bikini',
    'blazer',
    'blouse',
    'bodycon',
    'bodysuit',
    'boot',
    'bottom',
    'bra',
    'bracelet',
    'bralet',
    'bralette',
    'brief',
    'brogues',
    'cami',
    'cape',
    'cardigan',
    'chinos',
    'clutch',
    'coat',
    'corset',
    'culotte',
    'dress',
    'dungaree',
    'earring',
    'earrings',
    'espadrille',
    'gloves',
    'handbag',
    'hat',
    'headband',
    'heel',
    'hoodie',
    'hoody',
    'jacket',
    'jean',
    'jeggings',
    'jersey',
    'jewellery',
    'jogger',
    'jumper',
    'jumpsuit',
    'kimono',
    'knickers',
    'legging',
    'lingerie',
    'lipstick',
    'loafers',
    'makeup',
    'mules',
    'necklace',
    'nightwear',
    'pant',
    'parka',
    'playsuit',
    'polo',
    'pullover',
    'pyjama',
    'ring',
    'rucksack',
    'sandal',
    'scarf',
    'shirt',
    'shoe',
    'shoes',
    'shorts',
    'skirt',
    'sneakers',
    'sock',
    'suit',
    'sundress',
    'sunglasses',
    'sweater',
    'sweatshirt',
    'swim',
    'swimming',
    'swimsuit',
    'swimwear',
    't-shirt',
    't-shirts',
    'thong',
    'tights',
    'top',
    'tote',
    'tracksuit',
    'trainer',
    'trouser',
    'trunks',
    'tunic',
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
const pattern_cats = [
    'abstract',
    'acid',
    'animal',
    'bright',
    'cable',
    'camo',
    'camouflage',
    'cat',
    'charcoal',
    'check',
    'checked',
    'chevron',
    'circle',
    'clear',
    'contrast',
    'crochet',
    'daisy',
    'dark',
    'diamond',
    'distressed',
    'dot',
    'dye',
    'embellished',
    'embellishment',
    'embroidered',
    'embroidery',
    'floral',
    'flower',
    'geometric',
    'gingham',
    'heart',
    'jacquard',
    'knot',
    'lace',
    'lattice',
    'leopard',
    'light',
    'logo',
    'melange',
    'mesh',
    'metallic',
    'monochrome',
    'paisley',
    'pale',
    'palm',
    'pattern',
    'pinstripe',
    'polka',
    'print',
    'printed',
    'rainbow',
    'rib',
    'snake',
    'spot',
    'square',
    'star',
    'stitch',
    'stripe',
    'striped',
    'stripes',
    'tartan',
    'tea',
    'textured',
    'tiger',
    'tortoiseshell',
    'triangle',
    'tropical',
    'vanilla',
    'wash',
    'washed',
    'zebra'
];
const color_cats = [
    'apricot',
    'beige',
    'black',
    'blue',
    'brown',
    'burgundy',
    'camel',
    'camel',
    'cognac',
    'cream',
    'gold',
    'green',
    'grey',
    'heather',
    'honey',
    'indigo',
    'ivory',
    'khaki',
    'lettuce',
    'lilac',
    'lime',
    'mango',
    'matte',
    'mustard',
    'navy',
    'neon',
    'nude',
    'olive',
    'ombre',
    'orange',
    'orange',
    'pale',
    'peach',
    'peach',
    'pink',
    'pink',
    'purple',
    'purple',
    'red',
    'red',
    'reflective',
    'rose',
    'rust',
    'sand',
    'silver',
    'tan',
    'taupe',
    'white',
    'yellow'
];
const style_cats = [
    'a-line',
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
    'christmas',
    'chunky',
    'classic',
    'club',
    'crop',
    'cropped',
    'cross',
    'curved',
    'derby',
    'ditsy',
    'festival',
    'flare',
    'flared',
    'flat',
    'fluffy',
    'formal',
    'french',
    'fringe',
    'glam',
    'glamorous',
    'gym',
    'high',
    'homme',
    'large',
    'long-sleeve',
    'long',
    'longline',
    'loose',
    'lounge',
    'low',
    'mela',
    'milkmaid',
    'mom',
    'muscle',
    'oversized',
    'oxford',
    'pencil',
    'peplum',
    'petite',
    'pinafore',
    'plain',
    'platform',
    'pleated',
    'plunge',
    'puffer',
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
    'sheer',
    'shirred',
    'short',
    'skater',
    'skinny',
    'sleeveless',
    'slim-fit',
    'slim',
    'slinky',
    'slip',
    'smart',
    'smock',
    'south',
    'sport',
    'sporty',
    'stiletto',
    'straight',
    'strappy',
    'summer',
    'tailored',
    'tall',
    'tank',
    'tapered',
    'tie',
    'tiered',
    'track',
    'training',
    'trench',
    'unisex',
    'vintage',
    'wedding',
    'western',
    'wide',
    'winter',
    'wrap'
];
const material_cats = [
    'beaded',
    'borg',
    'cashmere',
    'chiffon',
    'chino',
    'cord',
    'corduroy',
    'cotton',
    'crochet',
    'denim',
    'down',
    'faux',
    'fishnet',
    'flannel',
    'fleece',
    'fur',
    'glitter',
    'jacquard',
    'knit',
    'knitted',
    'lace',
    'leather',
    'linen',
    'merino',
    'metal',
    'metallic',
    'nylon',
    'paper',
    'pearl',
    'plisse',
    'poplin',
    'puffer',
    'satin',
    'silk',
    'straw',
    'suede',
    'suedette',
    'tulle',
    'tweed',
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
    'cowl',
    'crewneck',
    'crinkle',
    'cup',
    'diamante',
    'double',
    'drape',
    'embossed',
    'frill',
    'halter',
    'halterneck',
    'heeled',
    'hem',
    'hood',
    'hooded',
    'insert',
    'knee',
    'leg',
    'mid',
    'monogram',
    'neck',
    'open',
    'pack',
    'padded',
    'panel',
    'panelled',
    'pocket',
    'puffer',
    'raglan',
    'ruffle',
    'sequin',
    'sequined',
    'shoulder',
    'skull',
    'sleeve',
    'sleeves',
    'soft',
    'straight-leg',
    'strap',
    'straps',
    'stretch',
    'stud',
    'studded',
    'sweat',
    'tassel',
    'tasselled',
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
    'zip',
    'zipped'
];
const length_cats = [
    'ankle',
    'full',
    'knee',
    'length',
    'long',
    'maxi',
    'mid',
    'mid-rise',
    'midaxi',
    'midi',
    'mini'
];
const filter_cats = [
    'curve',
    'curves',
    'mamalicious',
    'maternity',
    'plus'
];
const all_cats = kind_cats
    .concat(pattern_cats)
    .concat(color_cats)
    .concat(style_cats)
    .concat(material_cats)
    .concat(attribute_cats)
    .concat(length_cats)
    .concat(filter_cats);

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

        const pickerTagList = this.props.posTags.filter(this.getUniqueArr).map(filterTag => {
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
            const suggestTags = all_cats.filter(this.getUniqueArr).filter(tag => {
                return tag.toLowerCase().indexOf(this.state.searchString.toLowerCase()) !== -1
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
                            marginLeft: '5px',
                            borderRadius: '5px',
                            border: '2px rgba(1,1,1,0) solid',
                            paddingLeft: '2px',
                            paddingRight: '2px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            marginTop: '15px',
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
                            <div>
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
                            autoComplete="off"
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
