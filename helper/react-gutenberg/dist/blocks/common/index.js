Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("@loadable/component");
const Audio = (0, component_1.default)(() => Promise.resolve().then(() => require('./audio')));
const Cover = (0, component_1.default)(() => Promise.resolve().then(() => require('./cover')));
const File = (0, component_1.default)(() => Promise.resolve().then(() => require('./file')));
const Gallery = (0, component_1.default)(() => Promise.resolve().then(() => require('./gallery')));
const Heading = (0, component_1.default)(() => Promise.resolve().then(() => require('./heading')));
const Image = (0, component_1.default)(() => Promise.resolve().then(() => require('./image')));
const List = (0, component_1.default)(() => Promise.resolve().then(() => require('./list')));
const Paragraph = (0, component_1.default)(() => Promise.resolve().then(() => require('./paragraph')));
const Quote = (0, component_1.default)(() => Promise.resolve().then(() => require('./quote')));
const Video = (0, component_1.default)(() => Promise.resolve().then(() => require('./video')));
exports.default = {
    Audio,
    Cover,
    File,
    Gallery,
    Heading,
    Image,
    List,
    Paragraph,
    Quote,
    Video
};
//# sourceMappingURL=index.js.map