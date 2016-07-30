import 'should';

import Painter from '../../../src/painters/models/Painter';

describe('Painter model', () => {
    it('should have an _id property', () => {
        const painter = new Painter();
        painter.should.have.property('_id');
    });

    it('should have a name property', () => {
        const painter = new Painter();
        painter.should.have.property('name');
    });

    it('should have a dateOfBirth property', () => {
        const painter = new Painter();
        painter.should.have.property('dateOfBirth');
    });
});
