import React from "react";
require('../../../css/garms.css');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

class AddOutfit extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            username: this.props.username,
            email: this.props.email,
            looks: [],
            newLookInput: '',
            addingLook: false,
            imgHash: this.props.imgHash,
            prodId: null
        };

        this.showAddLookModal = this.showAddLookModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addOutfitToLook = this.addOutfitToLook.bind(this);
        this.addLook = this.addLook.bind(this);
        this.cancelAddOutfit = this.cancelAddOutfit.bind(this);
    }

    componentDidMount() {
        fetch(`${window.location.origin}/api/get_prod_hash`, {
            method: 'post',
            body: JSON.stringify({'img_hash': this.state.imgHash}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            // console.log(data);
            this.setState({
                prodId: data.prod_id
            })
        });
        fetch(`${window.location.origin}/api/get_looks`, {
            method: 'post',
            body: JSON.stringify({'email': this.state.email}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if (data.looks !== null) {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });

                this.setState({
                    looks: looksArr
                });
            }
        })
    }

    handleInputChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    showAddLookModal = () => {
        this.setState({
            addingLook: true
        });
    };

    addOutfitToLook = (lookName, prodId) => {
        // console.log(`lookName: ${lookName}, prodId: ${prodId}`);
        fetch(`${window.location.origin}/api/add_outfit`, {
            method: 'post',
            body: JSON.stringify({
                'email': this.state.email,
                'look_name': lookName,
                'prod_id': prodId
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            return response.json();
        }).then(data => {
            if(data === 'Invalid look') {
                alert('Invalid look')
            }
            this.props.addOutfitComplete();
        });
    };

    addLook = (e) => {
        e.preventDefault();
        let email = this.state.email;
        let lookName = this.state.newLookInput;
        fetch(`${window.location.origin}/api/add_look`, {
            method: 'post',
            body: JSON.stringify({email: email, look_name: lookName}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) { return response.json(); })
            .then(data => {
                const looksArr = data.looks.sort(function(a, b){
                    if(a.look_name < b.look_name) { return -1; }
                    if(a.look_name > b.look_name) { return 1; }
                    return 0;
                });
                this.setState({
                    looks: looksArr,
                    addingLook: false,
                    newLookInput: ''
                });
            });
    };

    cancelAddOutfit = () => {
        this.props.addOutfitComplete();
    };

    //############################# MAIN RENDER FUNCTION ################################
    render () {
        const lookList = this.state.looks.map(lookDict => {
            return (
                <div
                    className='add-to-look-tile'
                    onClick={() => {this.addOutfitToLook(lookDict.look_name, this.state.prodId)}}
                    key={lookDict.look_name}
                    style={{
                        width: '400px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginTop: '15px'
                    }}
                >
                    <h5>{lookDict.look_name.toUpperCase()}</h5>
                </div>
            )
        });

        return (
            <MuiThemeProvider>
                <div>
                    <div
                        style={{
                            width: '400px',
                            height: '25vh',
                            marginLeft: 'calc((100vw - 400px) / 2)',
                            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,1))',
                            position: 'fixed',
                            top: '0px'
                        }}
                    />
                    <div
                        style={{
                            width: '400px',
                            height: '50vh',
                            marginLeft: 'calc((100vw - 400px) / 2)',
                            backgroundColor: '#FFFFFF',
                            position: 'fixed',
                            top: '25vh'
                        }}
                    />
                    <div
                        style={{
                            width: '400px',
                            height: '25vh',
                            marginLeft: 'calc((100vw - 400px) / 2)',
                            backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0.3), rgba(255,255,255,1))',
                            position: 'fixed',
                            top: '75vh'
                        }}
                    />
                    <div
                        style={{
                            width: '400px',
                            height: '100vh',
                            marginLeft: 'calc((100vw - 400px) / 2)',
                            position: 'fixed',
                            top: '50px',
                            display: 'table'
                        }}
                    >
                        <div
                            style={{
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }}
                        >
                            <div
                                style={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    width: '400px',
                                    textAlign: 'center',
                                    paddingTop: '-100px'
                                }}
                            >
                                <div
                                    className="add-outfit-cancel"
                                    onClick={() => {this.cancelAddOutfit()}}
                                />
                                <h3>Add To Look</h3>
                                <br />
                                {(this.state.looks.length > 0) ? (lookList) : (
                                    <p>No looks found, add look to continue</p>
                                )}
                                <div
                                    style={{
                                        width: '400px',
                                        backgroundColor: '#e3e3e3',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        marginTop: '25px'
                                    }}
                                    key='add-look'
                                    onClick={this.showAddLookModal}
                                >
                                    <h5>ADD NEW LOOK</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {(this.state.addingLook) && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '70px',
                                    width: '300px',
                                    left: 'calc(50vw - 150px)',
                                    textAlign: 'center'
                                }}
                            >
                                <Paper zDepth={1} style={{paddingTop: '10px'}}>
                                    <h3>Add Look</h3>
                                    <form onSubmit={this.addLook}>
                                        <label>
                                            Input look name:
                                            <input
                                                autoFocus
                                                type="text"
                                                name="newLookInput"
                                                value={this.state.newLookInput}
                                                onChange={this.handleInputChange}
                                            />
                                        </label>
                                        <input
                                            style={{
                                                color: 'black',
                                                backgroundColor: 'white',
                                                borderRadius: '4px',
                                                borderWidth: '2px',
                                                borderColor: 'black',
                                                borderStyle: 'solid',
                                                marginTop: '5px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                cursor: 'pointer',
                                                marginBottom: '10px'
                                            }}
                                            type="submit"
                                            value="Add Look"
                                        />
                                    </form>
                                </Paper>
                            </div>
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default AddOutfit;
