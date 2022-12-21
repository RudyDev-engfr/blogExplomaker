Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
const React = require("react");
const ArrowRightAlt_1 = require("@material-ui/icons/ArrowRightAlt");
const core_1 = require("@mantine/core");
const useStyles = (0, core_1.createStyles)({
    buttonsSpot: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        top: '76px',
        right: '-20px',
        zIndex: 3,
        height: '100px',
    },
    carouselArrow: {
        color: '#009D8C',
        backgroundColor: '#E6F5F4',
        borderRadius: '5px',
        width: '70px',
        height: '45px',
        '&:hover': {
            backgroundColor: '#E6F5F4',
        },
    },
});
const CustomButtonGroup = ({ next, previous }) => {
    const { classes } = useStyles();
    return (React.createElement(core_1.Box, { className: classes.buttonsSpot },
        React.createElement(core_1.Button, { className: classes.carouselArrow, onClick: () => {
                previous();
                console.log('salut');
            } },
            React.createElement(ArrowRightAlt_1.default, { style: { transform: 'rotate(180deg)' }, fontSize: "large" })),
        React.createElement(core_1.Button, { className: classes.carouselArrow, onClick: () => next() },
            React.createElement(ArrowRightAlt_1.default, { fontSize: "large" }))));
};
exports.default = CustomButtonGroup;
//# sourceMappingURL=CustomButtonGroup.js.map