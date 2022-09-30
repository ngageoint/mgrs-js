import { expect } from 'chai';
import { GridType } from '../../lib/grid/GridType';
import { GridTypeUtils } from '../../lib/grid/GridTypeUtils';

/**
 * Grid Type Test
 * 
 * @author osbornb
 */
describe('GridType Tests', function () {

    /**
	 * Test precisions
	 */
    it('test precisions', function () {
        expect(GridType.GZD).to.equal(0);
		expect(GridType.HUNDRED_KILOMETER).to.equal(100000);
		expect(GridType.TEN_KILOMETER).to.equal(10000);
		expect(GridType.KILOMETER).to.equal(1000);
		expect(GridType.HUNDRED_METER).to.equal(100);
		expect(GridType.TEN_METER).to.equal(10);
		expect(GridType.METER).to.equal(1);
    });
});