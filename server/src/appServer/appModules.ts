import IAppModule from '../common/IAppModule';
import PainterModule from '../painters';

const appModules = (): IAppModule[] => [
    PainterModule.Init()
];

export default appModules;
