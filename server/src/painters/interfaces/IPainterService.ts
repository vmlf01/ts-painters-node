import IPaginatedResults from '../../common/IPaginatedResults';
import IPainter from './IPainter';

export interface IPainterOptions {
    skip: number;
    take: number;
}

export interface IPainterService {
    getAll(options?: IPainterOptions): Promise<IPaginatedResults<IPainter>>;
    get(id: string): Promise<IPainter>;
    save(IPainter): Promise<IPainter>;
}

export default IPainterService;
