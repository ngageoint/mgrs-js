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

    /**
	 * Test digit accuracies
	 */
    it('test accuracies', function () {
        expect(GridTypeUtils.getAccuracy(GridType.GZD)).to.equal(0);

		expect(GridTypeUtils.withAccuracy(0)).to.equal(GridType.HUNDRED_KILOMETER);
		expect(GridTypeUtils.getAccuracy(GridType.HUNDRED_KILOMETER)).to.equal(0);

		expect(GridTypeUtils.withAccuracy(1)).to.equal(GridType.TEN_KILOMETER);
		expect(GridTypeUtils.getAccuracy(GridType.TEN_KILOMETER)).to.equal(1);

		expect(GridTypeUtils.withAccuracy(2)).to.equal(GridType.KILOMETER);
		expect(GridTypeUtils.getAccuracy(GridType.KILOMETER)).to.equal(2);

		expect(GridTypeUtils.withAccuracy(3)).to.equal(GridType.HUNDRED_METER);
		expect(GridTypeUtils.getAccuracy(GridType.HUNDRED_METER)).to.equal(3);

		expect(GridTypeUtils.withAccuracy(4)).to.equal(GridType.TEN_METER);
		expect(GridTypeUtils.getAccuracy(GridType.TEN_METER)).to.equal(4);

		expect(GridTypeUtils.withAccuracy(5)).to.equal(GridType.METER);
		expect(GridTypeUtils.getAccuracy(GridType.METER)).to.equal(5);
    });
});