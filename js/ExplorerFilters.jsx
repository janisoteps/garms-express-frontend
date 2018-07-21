import React from "react";
require('../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Slider from 'material-ui/Slider';
require('../css/ball-atom.css');
import { CirclePicker } from 'react-color';

let brandAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'v', 'w', 'z', 'x', 'q', 'y', 'u', '1', '3', '8', '2', '7'];
let brandDictionary = {
    '': [''], 'a': ['Agatha Ruiz de la Prada', 'Aigle', 'Another Influence', 'Adrianna Papell', 'Anna Field Select', 'Asics', 'ANGULUS', 'Amorph Berlin', 'Aigner', 'ASOS 4505', 'Abro', 'And Less', 'ASOS White', 'adidas Golf', 'Anton Heunis', 'AX Paris', 'Adidas', 'adidas by Stella McCartney', 'Asics Tiger', 'A.S.98', 'ADIA', 'Armor lux', 'Arena', 'Armani Exchange', 'American Vintage', 'Antony Morato', 'Anna Field Curvy', 'AllSaints', 'ASOS Maternity', 'Alpha Industries', 'ASICS', 'Abercrombie & Fitch', 'ASOS Petite', 'ASOS Curve', 'ASOS Tall', 'ALDO', 'adidas Originals', 'adidas Performance', 'Anna Field', 'ASOS'], 'b': ['Bogner Fire + Ice', 'Bondi Born', 'Benefit', 'Bruun & Stengade', 'boohooMAN', 'B ACTIVE by Beachlife', 'Boohoo Petite', 'Bronx', 'Billi Bi', 'Brett & Sons', 'Brixtol Textiles', 'Billieblush', 'Burlington', 'Burberry', 'BAD RHINO', 'BEBO', 'Bellfield', 'Buffalo', 'Band of Outsiders', 'Betty & Co', 'Bianco', 'Bullboxer', 'Beachlife', 'Bruno Premi', 'Bruuns Bazaar', 'Bisgaard', 'Blue Effect', 'bellybutton', 'b.young', 'Bergans', 'Barbour International™', 'Ben Sherman', 'Burton Menswear', 'BOSS Kidswear', 'BlueBella', 'Banana Moon', 'Bik Bok', 'Birkenstock', 'Bardot', 'Bogner', 'Brunotti', 'Brixton', 'Becksöndergaard', 'Baum und Pferdgarten', 'By Malene Birger', 'Bench', 'Blue Seven', 'Boohoo', 'Blend', 'Belstaff', 'Bershka', 'Björn Borg', 'Bugatti', 'Barbour', 'Billabong', 'Burton Menswear London', 'Banana Republic', 'BOSS Green', 'Brave Soul', 'BOSS', 'BOSS Orange', 'Benetton'], 'c': ["Cassis côte d'azur", 'Closet London', 'Colmar', 'CZ by Kenneth Jay Lane', 'Candice Cooper', 'Carolina Cavour', 'Christopher Raeburn', 'CG – Club of Gents', 'Carrement Beau', 'Custommade', 'Cath Kidston', "Chasin'", 'Clarks Originals', 'CHPO', 'Carvela', 'Casual Friday', 'Color Kids', 'Cayler & Sons', 'Coast', 'Cosabella', 'Claesen‘s', 'Cortefiel', 'Casall', 'Compañía fantástica', 'Caprice', 'Cartoon', 'Champion Reverse Weave', 'Chie Mihara', 'Club Monaco', 'Camper', 'Circle of Trust', 'City Chic', 'Closet', 'Club L', 'CELIO', 'Call it Spring', 'Chi Chi London', 'Calvin Klein Swimwear', 'Crocs', 'Cars Jeans', 'Curare Yogawear', 'Culture', 'comma casual identity', 'Chantelle', 'camel active', 'Clarks', 'Coccinelle', 'CMP', 'CLOSED', 'Coach', 'Craft', 'comma', 'Cheap Monday', 'Champion', "Carter's", 'Cream', 'Columbia', 'Carhartt WIP', 'Calvin Klein Underwear', 'Converse', 'Calvin Klein Jeans', 'Calvin Klein'], 'd': ['Damir Doma', 'Daisy Street', 'Deha', 'Donna Carolina', 'Dead Vintage', "Djinn's", 'Double Agent', 'Dr Denim', 'Dune', 'DesignB London', 'Dr Martens', 'Dakine', 'Denim is Dead', 'Duke', 'Dr.Denim', 'DIM', 'DOCKERS', 'Dora Larsen', 'Dr. Martens', 'Didriksons', 'Divine Factory', 'Dyrberg/Kern', 'Denham', 'Dolce&Gabbana', 'Dorothy Perkins Petite', 'Dorothy Perkins Tall', 'Derhy', 'DC Shoes', 'Diadora', 'Disney', 'Dorothy Perkins Curve', 'DRYKORN', 'Dune London', 'DKNY Intimates', 'DAY Birger et Mikkelsen', 'DKNY', 'Dickies', 'Desigual', 'Dorothy Perkins', 'Diesel'], 'e': ['Eton', 'Espadrij l´originale', 'Emily van den Bergh', 'Escada Sport', 'Ewers', 'Erima', 'Eterna', 'El Naturalista', 'Eat ants by Sanetta', 'Even&Odd Curvy', 'Etam', 'Edwin', 'Enter', 'Eastpak', 'ERASE', 'Expresso', 'Envii', 'Evans', 'ecco', 'Element', 'Ellesse', 'Esprit Collection', 'Even&Odd active', 'Emporio Armani', 'edc by Esprit', 'Esprit', 'Even&Odd'], 'f': ['Fashion Union Tall', 'Fred de la Bretoniere', 'Felmini', 'Floris van Bommel', 'fullstop.', 'Forvert', 'Froddo', 'Fiorelli', 'Freequent', 'Frugi', 'Fashion Union Petite', 'For Love & Lemons', 'Frame Denim', 'Frieda & Freddies', 'Fiveunits', 'Funkita', 'FTC Cashmere', 'Freeman T. Porter', 'Freya', 'Freaky Nation', 'Faith', 'Fred Perry', 'FREDsBRUDER', 'Finery London', 'Fashion Union', 'Fritzi aus Preußen', 'Fila', 'Furla', 'Farah', 'Falke', 'Friboo', 'Filippa K', 'French Connection', 'Free People', 'Fossil'], 'g': ['G. H. Bass & Co.', 'Giorgio 1958', 'Glamorous Tall', 'Globe', 'Giesswein', 'G.I.G.A. DX', 'Grace', 'Gelati Kidswear', 'Glorious Gangsta', 'Gioseppo', 'Good For Nothing', 'Glamorous Petite', 'Glamorous Curve', 'Goosecraft', 'Gipsy', 'Gossard', 'Gestuz', 'Gina Tricot', 'Gore Wear', 'Gabor', 'Geox', 'Glamorous', 'GANT', 'G-Star', 'Guess', 'GAP'], 'h': ['Herrlicher', 'Hilfiger Denim', 'Hurley', 'Happy Plugs', 'Heidi Klum Intimates', 'Hey Honey', 'Hot Soles', 'Hust & Claire', 'happy girls', 'H by Hudson', 'HUF', 'Hackett Aston Martin Racing', 'Helia', 'Herschel Supply Co', 'Hobbs', 'Hot as Hell', 'Harry Brown', 'Heidi Klein', 'House of Dagmar', 'Hunter', 'Haglöfs', 'Hanro', 'HOM', 'Hollister', 'HUB', 'Hype', 'Holzweiler', 'Heart & Dagger', 'Head', 'Helly Hansen', 'Hackett London', 'Högl', 'Herschel', 'Hummel', 'Hollister Co.', 'Hunkemöller', 'HUGO'], 'i': ['IKKS', 'Incase', 'Ivko', 'igi natur', 'Ibana', 'Influence', 'I.scenery', 'Isla Ibiza Bonita', 'iBlues', 'InWear', 'Ilse Jacobsen', 'INDICODE JEANS', 'Iceberg', 'IVY & OAK', 'Icon Brand', 'ICHI', 'Ivy Park', 'Icepeak', 'Icebreaker', 'Ivyrevel'], 'j': ['Johnny Loves Rosie', 'Jeffrey Campbell', 'Jochie & Freaks', 'Juvia', 'Jeffery West', 'J Brand', 'Juicy Couture', 'Jil Sander Navy', 'Jost', 'Josephine & Co', 'JUST FEMALE', 'Jeepers Peepers', 'JOOP! Jeans', 'Jaded London', 'Jack Wills', 'Jacky Baby', 'Jennyfer', 'Jordan', 'Junarose', 'Jack Wolfskin', 'JOOP!', 'Just Cavalli', 'J.CREW', 'JDY', 'J.LINDEBERG', 'Jack & Jones'], 'k': ['K1X', 'KangaROOS', 'Kanna', 'KG Kurt Geiger', 'Komono', 'kate spade new york', 'KIOMI TALL', 'Kangol', 'Kings Of Indigo', 'Key Largo', 'Kronstadt', 'khujo', 'K-Way', 'Karen by Simonsen', 'Karen Millen', 'Key West', 'Kings Will Dream', 'King Louie', 'Kickers', 'Konplott', 'Keen', 'Knowledge Cotton Apparel', 'Kaporal', 'Kennel + Schmenger', 'Kenzo', 'Kipling', 'Kappa', 'KARL LAGERFELD', 'Kaffe', 'KIOMI'], 'l': ['LEGO Wear', 'Larsson & Jennings', 'Lauren Ralph Lauren Petite', 'Lavish Alice', 'Legends', 'La Queue du Chat', 'Little Marc Jacobs', 'Lumberjack', 'LOIS Jeans', 'Levete Room', 'Lost Ink Petite', 'Le Breve', 'Liquor N Poker', 'Lauren Ralph Lauren Woman', "Levi's® Plus", 'LOYALTY & FAITH', 'Lancel', 'Louche', 'Legend', 'Les Tropéziennes par M Belarbi', 'Libertine-Libertine', 'Lotto', 'Love Triangle', 'La Perla', 'Lloyd', 'La Martina', 'Luhta', 'Lace & Beads', 'Lipsy', "Levi's® Line 8", 'Le Specs', 'Liu Jo Jeans', 'le coq sportif', 'LYDC London', 'Levis', 'Lindbergh', 'LAGERFELD', 'Lova & Rosie', 'Les Girls Les Boys', 'Le Temps Des Cerises', 'Lez a Lez', 'Little Mistress', 'Lost Ink Plus', 'LIU JO', 'LOVE Stories', 'Lacoste LIVE', 'L.Credi', 'LTB', 'Lacoste Sport', 'LASCANA', 'Lyle & Scott', 'Lemon Beret', 'Love Moschino', 'Liebeskind Berlin', 'Lee', 'Lost Ink', 'Lacoste', 'Lauren Ralph Lauren', "Levi's®"], 'm': ['MARCIANO LOS ANGELES', 'Madden Girl', 'Magnanni', 'Milk It', 'Miss KG', 'Monkee Genes', 'M Missoni', 'MJUS', 'MOSCHINO SWIM', 'Marvel', 'Maze', 'MOSCHINO', 'Magic Nights', 'Manduka', 'Maria Black', 'Mascara', 'Meru', 'Mini Molly', 'Maya Deluxe', 'Missguided Petite', 'Motel', 'MAI PIÙ SENZA', 'Maharishi', 'Maidenform', 'Menil', 'Merc', 'Mother of Pearl', 'Melissa Odabash', 'Millet', 'Mikoh', 'Moves', "Marc O'Polo DENIM", 'Miansai', 'MSGM', 'Mama.licious', 'Merrell', 'Makia', 'Mango', 'Mads Nørgaard', 'Marella', 'Miss Selfridge Petite', 'Miss Sixty', 'Modström', 'Matt & Nat', 'Melvin & Hamilton', 'Mos Mosh', 'Marc Jacobs', 'Molo', 'Mizuno', 'mbyM', 'MAGIC Bodyfashion', 'Mennace', 'Moss Copenhagen', 'Mint Velvet', 'Molly Bracken', 'Mustang', 'Marco Tozzi', 'Mavi', 'Monki', 'mothercare', 'Mammut', 'mtng', 'Morgan', 'More & More', 'McQ Alexander McQueen', 'MAX&Co.', 'Minimum', 'Miss Selfridge', 'Michael Kors', 'Missguided', 'MICHAEL Michael Kors', "Marc O'Polo", 'mint&berry'], 'n': ['New Look Tall', 'Neosens', 'Nike Vision', 'Nanga', 'Newline', 'New Look Plus', 'Noisy May Tall', 'New Look Maternity', 'Navy London', 'New Look 915 Generation', 'Nümph', 'Needle & Thread', 'Neil Barrett BLACKBARRETT', 'Noak', 'NON COMMUN', 'New Look Petite', 'Noisy May Petite', 'Noppies', 'Nike Running', 'Noose & Monkey', 'Nixon', 'Nike Training', 'New Look Curves', 'Nudie Jeans', 'Nike SB', 'New Look Wide Fit', 'New Era', 'Name it', 'Nike', 'NA-KD', 'NAF NAF', 'New Balance', 'Napapijri', 'Noa Noa', 'Noisy May', 'Nike Sportswear', 'Nike Performance', 'New Look'], 'o': ['Onzie', 'Oh My Love', 'OLYMP No. Six', 'Osprey', 'Oakley', 'Original Penguin', 'OLYMP Level Five', 'Only Carmakoma', 'Outfit Kids', 'Office', 'one more story', 'ONLY SHOES', 'Orelia', 'Olivia Burton', 'Only', 'Only Petite', 'OshKosh', "O'Neill", 'Oakwood', 'Object', 'Opus', 'Oasis', 'Only Play', 'ODLO', 'Obey Clothing', 'OVS', 'Only & Sons', 'ONLY'], 'p': ['Packmack', 'Park Lane', 'Peek & Beau', 'Parisian', 'People Wear Organic', 'Pons Quintana', 'Part Two', 'Pepino', 'Peuterey', 'Prada Linea Rossa', 'Pretty Green', 'Pura Lopez', 'Panama Jack', 'Primigi', 'PERLATO', 'Peralston', 'Pink Clove', 'Pierre Balmain', 'Paper Dolls', 'Polo Ralph Lauren Golf', 'Pimkie', 'Polaroid', 'PrAna', 'Palladium', 'Peak Performance', 'PYRENEX', 'Picard', 'Persona by Marina Rinaldi', 'Pull&Bear', 'PrettyLittleThing', 'Pretty Ballerinas', 'Puma Golf', 'Plein Sport', 'Prada', 'Petrol Industries', 'Public Desire', 'Pinko', 'Petit Bateau', 'Peter Kaiser', 'Palmers', 'Passionata', 'Patagonia', 'PARFOIS', 'Produkt', 'Pilgrim', 'Patrizia Pepe', 'PS by Paul Smith', 'Pieces', 'Pepe Jeans', 'Puma', 'Pier One', 'Polo Ralph Lauren'], 'r': ['Ragwear Plus', 'Resteröds', 'Raid', 'Radà', 'River Island Plus', 'RVCA', 'Roberto Collina', 'Reiss', 'RVLT', 'Retour Jeans', 'Rebecca Minkoff', 'Richter', 'Refresh', 'Rich & Royal', 'Rosantica', 'RAID', 'Ragwear', 'Reef', 'Rosemunde', 'Redefined Rebel', 'Reclaimed Vintage', 'Rains', 'Regatta', 'Royal RepubliQ', 'Religion', 'Rip Curl', 'Ray-Ban', 'Reebok Classic', 'Roxy', 'Replay', 'Reebok', 'River Island'], 's': ['SPM', "Scotch R'Belle", 'Steiff Collection', 'Scotch Shrunk', 'Sunseeker', 'Santa Monica', 'SET', 'Sail Racing', 'Selected', 'Shoe The Bear', 'Spiral Bags', 'sergio tacchini', 'Sixth June', 'Skinny Dip', 'Småfolk', 'Sparkz', 'Spikes & Sparrow', 'Second Script Curve', 'See by Chloé', 'Soft Gallery', 'Stine Goya', 'Skechers Performance', 'Soaked in Luxury', 'Soft Rebels', 'Suit', 'Sundry', 'Serge Pariente', 'Storm & Marie', 'Saucony', 'Simply Be', 'Sportmax Code', 'Sista Glam', 'Sixtyseven', 'Second Female', 'Sandqvist', 'Shine Original', 'Soulland', 'Stefanel', 'Superga', 'someday.', 'See u Soon', 'Solid', 'Swatch', 'Skechers Sport', 'Sister Jane', 'South Beach', 'Speedo', 'Seidensticker', 'Smartwool', 'Sanetta', 'Short Stories', 'Sand Copenhagen', 'Saint Tropez', 'Schott NYC', 'SIKSILK', 'Strellson', 'Staccato', 'Stradivarius', 'SNÖ of Sweden', 'Superfit', 'Swing', 'Springfield', 'sweet deluxe', 'Smash', 'Stance', 'Skechers', 'Spanx', 's.Oliver BLACK LABEL', 'Steffen Schraut', 'Skiny', 'Salomon', 'Sloggi', 'Skagen', 'Steve Madden', 'Soyaconcept', 'Schiesser', 'Selected Femme', 'Samsøe & Samsøe', 'Sisley', 'Scotch & Soda', 'Seafolly', 'Selected Homme', 's.Oliver RED LABEL', 'Superdry'], 't': ['TomShot', 'talkabout', 'Traffic People', 'TFNC Tall', "Tumble 'n dry", 'Teva', 'The Ragged Priest', 'Threadbare', 'Twintip Plus', 'Timex', 'Three Floor', 'The New', 'True Decadence', 'Teddy Smith', 'Truffle Collection', 'TOMS', 'Tom Joule', 'TFNC', 'The Kooples SPORT', 'Tigha', 'THOMAS SABO', 'Tiffosi', 'True Religion', 'Trussardi Jeans', 'Tommy Hilfiger Tailored', 'Tory Burch', 'The Kooples', 'Tiger of Sweden', 'Timberland', 'Tamaris', 'Triumph', 'TWINTIP', 'TOM TAILOR DENIM', 'The North Face', 'Ted Baker', 'TOM TAILOR', 'Tommy Jeans', 'Tommy Hilfiger', 'Top Man', 'Top Shop'], 'v': ['Vivienne Westwood Anglomania', 'Vibe Harsløf', 'Vivienne Westwood', 'Vanessa Bruno', 'van Laack', 'Vive Maria', 'Victoria Shoes', 'Vero Moda Petite', 'VOGUE Eyewear', 'Veja', 'Vero Moda Tall', 'Vagabond', 'Venice Beach', 'Vingino', 'Vanzetti', 'Versace Collection', 'Volcom', 'Versace', 'Vaude', 'Versus Versace', 'Valentino by Mario Valentino', 'Versace Jeans', 'Vans', 'Vila', 'Vero Moda'], 'w': ['WeSC', 'White Stuff', 'Weekend', 'White Mountaineering', 'WAL G.', 'Wrangler by Peter Max', 'Wallis Petite', 'Wheat', 'We are Cph', 'Wemoto', 'Wolf & Whistle', 'Won Hundred', 'WEEKEND MaxMara', 'Warehouse', 'Whistles', 'Wood Wood', 'Wallis', 'Wrangler', 'Weekday'], 'z': ['Zoe Karssen', 'Zalando Essentials Petite', 'ZAC Zac Posen', 'Zalando Essentials Curvy', 'Zadig & Voltaire', 'Zizzi', 'Zign', 'Zalando Essentials'], 'x': ['xyxyx', 'XTI'], 'q': ['QED London', 'Q/S designed by', 'Quiksilver'], 'y': ['Yogasearcher', 'YOGA CURVES', 'Y.A.S Tall', 'YMC You Must Create', 'YAS Tall', 'Y.A.S', 'Your Turn Active', 'YAS', 'YOURTURN'], 'u': ['Uvex', 'UGG', 'Unisa', 'Urban Classics', 'Under Armour'], '1': ['12 Midnight'], '3': ['3 Pommes'], '8': ['8848 Altitude'], '2': ['2nd Day'], '7': ['7 for all mankind']
};
let shopList = ['ASOS', 'TOP SHOP', 'TOP MAN', 'ZALANDO', 'FARFETCH'];

//Child component of Explorer, offers to set more filters before performing search
class ExplorerFilters extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            sex: this.props.sex,
            selectedSex: undefined,
            mainCatTop: this.props.mainCatTop,
            mainCatSub: this.props.mainCatSub,
            background: '#fff',
            colorRGB: {},
            colorSelected: false,
            letter: '',
            brands: ['All'],
            shops: ['ASOS', 'TOP SHOP', 'TOP MAN', 'ZALANDO', 'FARFETCH'],
            priceSlider: 5000
        };
    }

    handlePriceSlider = (event, value) => {
        this.setState({priceSlider: value});
    };

    handleChangeComplete = (color) => {
        this.setState({
            background: color.hex,
            colorRGB: color.rgb,
            colorSelected: true
        });
    };

    selectLetter = (letter) => {
        console.log('Letter set to: ', letter);
        this.setState({
            letter: letter
        });
    };

    selectBrand = (brand) => {
        console.log('Brand set to: ', brand);
        let brands = this.state.brands;
        if(brands[0] === 'All'){
            brands = []
        }
        if(!brands.includes(brand)){
            brands.push(brand);
        }
        this.setState({
            brands: brands
        });
    };

    removeBrand = (brand) => {
        console.log('Brand removed: ', brand);
        let brands = this.state.brands;
        let index = brands.indexOf(brand);
        if (index > -1) {
            brands.splice(index, 1);
        }
        if(brands.length === 0){
            brands = ['All']
        }
        this.setState({
            brands: brands
        });
    };

    setSex = (sex) => {
        console.log('Setting sex to: ', sex);
        this.setState({
            selectedSex: sex
        });
    };

    setShop = (shop) => {
        let shopList = this.state.shops;
        if(shopList.includes(shop)){
            console.log('Removing shop: ', shop);
            let index = shopList.indexOf(shop);
            if (index > -1) {
                shopList.splice(index, 1);
            }
            this.setState({
                shops: shopList
            });
        } else {
            console.log('Adding shop: ', shop);
            shopList.push(shop);
            this.setState({
                shops: shopList
            });
        }
    };

    explorerSearch = () => {
        let mainCatTop = this.state.mainCatTop;
        let mainCatSub = this.state.mainCatSub;
        let sex = this.state.sex;
        let colorSelected = this.state.colorSelected;
        let shops = this.state.shops;
        let brands = this.state.brands;
        let maxPrice = this.state.priceSlider;
        let color = this.state.colorRGB;

        this.props.explorerSearch(mainCatTop, mainCatSub, sex, colorSelected, shops, brands, maxPrice, color);
    };

    render () {

        let SexTiles = () => {
            let setSex;
            if(this.state.selectedSex === undefined){
                setSex = this.state.sex;
            } else {
                setSex = this.state.selectedSex;
            }
            let womenStyle = {
                padding: '5px',
                display: 'inline-block',
                margin: '15px',
                // backgroundColor: '#f1f1f1',
                borderRadius: '5px',
                fontSize: '1.3rem',
                borderWidth: setSex === 'women' && '4px',
                borderColor: setSex === 'women' && '#1c1525',
                borderStyle: setSex === 'women' && 'solid',
                cursor: 'pointer'
            };
            let menStyle = {
                padding: '5px',
                display: 'inline-block',
                margin: '15px',
                // backgroundColor: '#f1f1f1',
                borderRadius: '5px',
                fontSize: '1.3rem',
                borderWidth: setSex === 'men' && '4px',
                borderColor: setSex === 'men' && '#1c1525',
                borderStyle: setSex === 'men' && 'solid',
                cursor: 'pointer'
            };
            return(
                <div style={{textAlign: 'center'}}>
                    <div
                        style={womenStyle}
                        onClick={() => {this.setSex('women');}}
                    >women</div>
                    <div
                        style={menStyle}
                        onClick={() => {this.setSex('men');}}
                    >men</div>
                </div>
            )
        };

        let shopTiles = shopList.map((shop) => {
            let selected = this.state.shops.includes(shop);
            let shopStyle = {
                margin: '5px',
                borderRadius: '5px',
                padding: '5px',
                borderWidth: selected && '4px',
                borderColor: selected && '#1c1525',
                borderStyle: selected && 'solid',
                display: 'inline-block',
                cursor: 'pointer'
            };
            return (
                <div
                    style={shopStyle}
                    onClick={() => {this.setShop(shop);}}
                    key={shop}
                >
                    {shop}
                </div>
            )
        });

        let alphabet = brandAlphabet.map(letter => {
            return (
                <div
                    className="explorer-alphabet-letter"
                    key={letter}
                    onClick={() => {this.selectLetter(letter);}}
                >
                    {letter}
                </div>
            )
        });

        let brandList = brandDictionary[this.state.letter].map((brand) => {
            return (
                <div
                    className="explorer-brand-tile"
                    key={brand}
                    onClick={() => {this.selectBrand(brand);}}
                >
                    <div className="explorer-brand-add"/>
                    <div className="explorer-brand-tile-title">
                        {brand}
                    </div>
                </div>
            )
        });

        let selectedBrands = this.state.brands.map((brand) => {
            return (
                <div
                    className="explorer-brand-tile"
                    key={brand}
                    onClick={() => {this.removeBrand(brand);}}
                >
                    <div className="explorer-brand-remove"/>
                    <div className="explorer-brand-tile-title">
                        {brand}
                    </div>
                </div>
            )
        });

        return (
            <MuiThemeProvider>
                <div style={{backgroundColor: 'rgba(' + this.state.colorRGB['r'] + ', ' + this.state.colorRGB['g'] + ', ' + this.state.colorRGB['b'] +', 0.3)'}}>

                    <div className="explorer-sex-selection-pane">
                        <SexTiles />
                    </div>

                    <div className="explorer-color-selection-pane">
                        <h3>What color are you looking for?</h3>
                        <CirclePicker
                            onChange={ this.handleChangeComplete }
                            width={'90vw'}
                            circleSize={40}
                            circleSpacing={16}
                            colors={[
                                "#f20707",
                                "#f44336",
                                "#e91e63",
                                "#9c27b0",
                                "#673ab7",
                                "#3f51b5",
                                "#2196f3",
                                "#00bcd4",
                                "#009688",
                                "#4caf50",
                                "#8bc34a",
                                "#cddc39",
                                "#ffeb3b",
                                "#ffc107",
                                "#ff9800",
                                "#ff5722",
                                "#795548",
                                "#000000",
                                "#474747",
                                "#949494",
                                "#eeeeee"
                            ]}
                        />
                    </div>

                    <div className="explorer-shop-selection-pane">
                        <h3>What are your favorite shops?</h3>
                        {shopTiles}
                    </div>

                    <div className="explorer-brand-selection-pane">
                        <h3>What are your favorite brands?</h3>
                            {(this.state.brands.length > 0) && (
                                <div className="explorer-brand-selected-list">
                                    {selectedBrands}
                                </div>
                            )}
                        <div className="explorer-alphabet">
                            {alphabet}
                        </div>
                        <div className="explorer-brand-list">
                            {(this.state.letter !== '') && (
                                brandList
                            )}
                        </div>
                    </div>

                    <div className="explorer-price-selection-pane">
                        <h3>What is maximum price?</h3>
                        <h2>£{this.state.priceSlider}</h2>
                        <Slider
                            min={0}
                            max={5000}
                            step={10}
                            value={this.state.priceSlider}
                            onChange={this.handlePriceSlider}
                        />
                    </div>

                    <div className="search-button" onClick={this.explorerSearch}><p>search</p></div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default ExplorerFilters;
