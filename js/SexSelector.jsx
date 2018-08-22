import React from 'react';


class SexSelector extends React.Component{
    constructor(props) {
        super(props);

        this.changeSex = this.changeSex.bind(this);
        this.expandSexSelector = this.expandSexSelector.bind(this);
    }

    changeSex(sex){
        this.props.changeSex(sex);
    }

    expandSexSelector(){
        this.props.expandSexSelector();
    }

    render () {
        let SexSelector = () => {
            let sexPickerStyle = {
                position: 'fixed',
                left: '10px',
                top: '60px',
                overflow: 'hidden',
                transition: 'width 300ms ease-in-out',
                width: this.props.sexPickerWidth,
                height: '48px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px 24px 24px 24px',
                boxShadow: '1px 1px 3px 0 rgba(0, 0, 0, 0.4)',
                textAlign: 'right'
            };

            let selectorHiderStyle = {
                position: 'fixed',
                left: '10px',
                top: '60px',
                overflow: 'hidden',
                transition: 'width 300ms ease-in-out',
                width: '48px',
                height: '48px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px 24px 24px 24px'
            };

            let sexOptionStyle1 = {
                display: 'inline-block',
                lineHeight: '28px',
                height: '48px',
                verticalAlign: 'middle',
                borderRadius: '24px',
                cursor: 'pointer',
                padding: this.props.sex !== 'women' ? '10px' : '5px',
                borderWidth: this.props.sex === 'women' && '5px',
                borderColor: this.props.sex === 'women' && '#7f649c',
                borderStyle: this.props.sex === 'women' && 'solid'
            };

            let sexOptionStyle2 = {
                display: 'inline-block',
                lineHeight: '28px',
                height: '48px',
                verticalAlign: 'middle',
                borderRadius: '24px',
                cursor: 'pointer',
                padding: this.props.sex !== 'men' ? '10px' : '5px',
                borderWidth: this.props.sex === 'men' && '5px',
                borderColor: this.props.sex === 'men' && '#7f649c',
                borderStyle: this.props.sex === 'men' && 'solid'
            };

            let sexOptionStyle3 = {
                display: 'inline-block',
                lineHeight: '28px',
                height: '48px',
                verticalAlign: 'middle',
                borderRadius: '24px',
                cursor: 'pointer',
                padding: this.props.sex !== '' ? '10px' : '5px',
                borderWidth: this.props.sex === '' && '5px',
                borderColor: this.props.sex === '' && '#7f649c',
                borderStyle: this.props.sex === '' && 'solid'
            };

            console.log('Image search sex: ', this.props.sex);

            return(
                <div>
                    <div style={sexPickerStyle}>
                        <div style={sexOptionStyle1} onClick={() => {this.changeSex('women')}}>women</div>
                        <div style={sexOptionStyle2} onClick={() => {this.changeSex('men')}}>men</div>
                        <div style={sexOptionStyle3} onClick={() => {this.changeSex('')}}>both</div>
                    </div>
                    <div style={selectorHiderStyle}></div>
                    <div className="sex-selector" onClick={this.expandSexSelector}></div>
                </div>
            )
        };

        return (
            <SexSelector/>
        )
    }
}

export default SexSelector;




