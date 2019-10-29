// TagPicker.jsx
import React from 'react';
import TextField from 'material-ui/TextField';

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

class TagPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: null,
            suggestedTags: null
        };
        this.onEnterPress = this.onEnterPress.bind(this);
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.props.addOwnCat(this.state.searchString);
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

    render() {

        const PickerSuggestions = () => {
            const suggestCats = all_cats.filter(cat => {
                return cat.indexOf(this.state.searchString) !== -1
            });
            const catTiles = suggestCats.map(suggestCat => {
                return (
                    <div
                        key={`${suggestCat}-${Math.random()}`}
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            this.props.addOwnCat(suggestCat)
                        }}
                    >
                        {suggestCat}
                    </div>
                )
            });

            return (
                <div>
                    {catTiles}
                </div>
            )
        };

        return (
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
                <TextField
                    autoFocus="autofocus"
                    className="text-search-input"
                    hintText={this.state.searchString ? this.state.searchString : "Tag..."}
                    floatingLabelText="Add another tag"
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
                    onClick={() => {this.props.addOwnCat(this.state.searchString)}}
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
                    CHOOSE
                </div>

                <div style={{
                    marginTop: '30px'
                }}>
                    {this.state.searchString !== null && (<PickerSuggestions />)}
                </div>
            </div>
        )
    }
}

export default TagPicker;
