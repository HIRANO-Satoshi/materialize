/* eslint-disable no-undef */

describe('Tooltip:', () => {
  let tooltippedBtn, tooltip;

  const fixture = `<a
  id="test"
  class="btn tooltipped"
  data-position="bottom"
  data-delay="50"
  data-tooltip="I am tooltip">
    Hover me!
</a>

<a
  id="test1"
  class="btn tooltipped"
  data-position="bottom"
  data-delay="50"
  data-tooltip="I am a tooltip that is really really long so that I would definitely overflow off the screen if I were not smart!">
   Hover me!
</a>

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

<div style="position: fixed; top: 50%; left: 50%;">
  <a
    id="test2"
    class="btn tooltipped"
    data-position="bottom"
    data-delay="50"
    data-tooltip="Fixed position tooltip">
     Hover me!
  </a>
</div>`;

  beforeEach(() => {
    XloadHtml(fixture);
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
      enterDelay: 0,
      exitDelay: 0,
      inDuration: 100,
      outDuration: 100
    });
  });
  afterEach(() => XunloadFixtures());

  describe('Tooltip opens and closes properly', () => {
    it('Opens a tooltip on mouse enter', function (done) {
      tooltippedBtn = document.querySelector('#test');
      tooltip = M.Tooltip.getInstance(tooltippedBtn).tooltipEl;
      // Mouse enter
      mouseenter(tooltippedBtn);
      setTimeout(() => {
        expect(tooltip).toBeVisible('because mouse entered tooltipped btn');
        expect(tooltip.querySelector('.tooltip-content').innerText).toBe(
          'I am tooltip',
          'because that is the defined text in the html attribute'
        );
        // Mouse leave
        mouseleave(tooltippedBtn);
        setTimeout(() => {
          expect(tooltip).toBeVisible('because mouse left tooltipped btn');
          done();
        }, 300);
      }, 200);
    });

    it('Positions tooltips smartly on the bottom within the screen bounds', function (done) {
      tooltippedBtn = document.querySelector('#test1');
      tooltip = M.Tooltip.getInstance(tooltippedBtn).tooltipEl;
      // Mouse enter
      mouseenter(tooltippedBtn);
      // tooltippedBtn.trigger('mouseenter');
      setTimeout(() => {
        let tooltipRect = tooltip.getBoundingClientRect();
        let tooltippedBtnRect = tooltippedBtn.getBoundingClientRect();
        // Check window bounds
        expect(tooltipRect.top).toBeGreaterThanOrEqual(0);
        expect(tooltipRect.bottom).toBeLessThanOrEqual(window.innerHeight);
        expect(tooltipRect.left).toBeGreaterThanOrEqual(0);
        expect(tooltipRect.right).toBeLessThanOrEqual(window.innerWidth);
        // check if tooltip is under btn
        expect(tooltipRect.top).toBeGreaterThan(tooltippedBtnRect.bottom);
        done();
      }, 300);
    });

    it('Removes tooltip dom object', () => {
      tooltippedBtn = document.querySelector('#test1');
      M.Tooltip.getInstance(tooltippedBtn).destroy();
      // Check DOM element is removed
      let tooltipInstance = M.Tooltip.getInstance(tooltippedBtn);
      expect(tooltipInstance).toBe(undefined);
    });

    it('Changes position attribute dynamically and positions tooltips on the right correctly', function (done) {
      tooltippedBtn = document.querySelector('#test');
      tooltippedBtn.setAttribute('data-position', 'right');
      tooltip = M.Tooltip.getInstance(tooltippedBtn).tooltipEl;
      // Mouse enter
      mouseenter(tooltippedBtn);
      setTimeout(() => {
        let tooltipRect = tooltip.getBoundingClientRect();
        let tooltippedBtnRect = tooltippedBtn.getBoundingClientRect();
        expect(tooltipRect.left).toBeGreaterThan(tooltippedBtnRect.right);
        done();
      }, 300);
    });

    it('Accepts delay option from javascript initialization', function (done) {
      tooltippedBtn = document.querySelector('#test');
      tooltippedBtn.removeAttribute('data-delay');
      M.Tooltip.init(tooltippedBtn, { enterDelay: 200 });
      tooltip = M.Tooltip.getInstance(tooltippedBtn).tooltipEl;
      mouseenter(tooltippedBtn);
      setTimeout(() => {
        let tooltipVisibility = getComputedStyle(tooltip).getPropertyValue('visibility');
        expect(tooltipVisibility).toBe('hidden', 'because the delay is 200 seconds');
      }, 150);
      setTimeout(() => {
        expect(tooltip).toBeVisible('because 200 seconds has passed');
        done();
      }, 250);
    });

    it('Works with a fixed position parent', function (done) {
      tooltippedBtn = document.querySelector('#test2');
      tooltip = M.Tooltip.getInstance(tooltippedBtn).tooltipEl;
      mouseenter(tooltippedBtn);
      setTimeout(() => {
        let tooltipRect = tooltip.getBoundingClientRect();
        let tooltippedBtnRect = tooltippedBtn.getBoundingClientRect();
        let verticalDiff = tooltipRect.top - tooltippedBtnRect.top;
        let horizontalDiff =
          tooltipRect.left +
          tooltipRect.width / 2 -
          (tooltippedBtnRect.left + tooltippedBtnRect.width / 2);
        // 52 is magic number for tooltip vertical offset... increased to 100
        expect(verticalDiff > 0 && verticalDiff < 100).toBeTruthy(
          'top position in fixed to be correct'
        );
        expect(horizontalDiff > -1 && horizontalDiff < 1).toBeTruthy(
          'left position in fixed to be correct'
        );
        done();
      }, 300);
    });
  });
});
