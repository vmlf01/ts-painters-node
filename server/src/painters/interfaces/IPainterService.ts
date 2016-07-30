import IPainter from './IPainter';

interface IPainterService {
    getAll(): Promise<IPainter[]>;
    get(id: string): Promise<IPainter>;
    save(IPainter): Promise<IPainter>;
}

export default IPainterService;
