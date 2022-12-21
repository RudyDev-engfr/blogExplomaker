var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
const React = require("react");
/* eslint-disable react/require-default-props */
const core_1 = require("@material-ui/core");
const clsx_1 = require("clsx");
const useStyles = (0, core_1.makeStyles)({
    indicatorsCountryGallery: {
        height: '6px',
        width: '6px',
        borderRadius: '50px',
        backgroundColor: '#D6F5F4',
    },
    activeColor: {
        backgroundColor: '#009D8C',
    },
    activeColorResults: {
        backgroundColor: `#006A75 !important`,
        height: '8px',
        width: '8px',
    },
    passiveColorResults: {
        backgroundColor: '#009D8C',
        marginBottom: '5px',
    },
    trendingDotBox: {
        display: 'flex',
        flexWrap: 'wrap',
        mt: 5,
        transform: 'translateY(50px)',
        zIndex: 10,
        alignSelf: 'flex-start',
        '@media (max-width: 600px)': {
            alignSelf: 'center',
        },
    },
});
const TrendingDestinationsDotBox = (_a) => {
    var { carouselArray, isResults = false, onClick } = _a, rest = __rest(_a, ["carouselArray", "isResults", "onClick"]);
    const { active } = rest;
    // onMove means if dragging or swiping in progress.
    // active is provided by this lib for checking if the item is active or not.
    const classes = useStyles();
    return (React.createElement(core_1.Box, { className: classes.trendingDotBox },
        React.createElement(core_1.Box, { component: core_1.ButtonBase, onClick: () => onClick(), height: "10px", mx: 1, borderRadius: "50px", marginBottom: "10px" },
            React.createElement(core_1.Box, { className: (0, clsx_1.default)(classes.indicatorsCountryGallery, {
                    [classes.activeColor]: active,
                    [classes.passiveColorResults]: isResults,
                    [classes.activeColorResults]: active && isResults,
                }) }))));
};
exports.default = TrendingDestinationsDotBox;
//# sourceMappingURL=TrendingDestinationsDotBox.js.map