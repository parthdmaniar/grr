'use strict';

goog.module('grrUi.semantic.timestampSecondsDirectiveTest');

const browserTriggerEvent = goog.require('grrUi.tests.browserTriggerEvent');
const semanticModule = goog.require('grrUi.semantic.semanticModule');
const testsModule = goog.require('grrUi.tests.testsModule');


describe('timestamp seconds directive', () => {
  const MILLI_IN_UNIT = 1000;
  let $compile;
  let $rootScope;


  // grr-timestamp-seconds is a wrapper around grr-timestamp.
  // We declare the dependency on grr-timestamp's template here in
  // order not to stub out the grr-timestamp directive and simply test
  // that the produced markup is correct.
  beforeEach(module('/static/angular-components/semantic/timestamp.html'));
  beforeEach(module(semanticModule.name));
  beforeEach(module(testsModule.name));

  beforeEach(inject(($injector) => {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
  }));

  const renderTestTemplate = (value) => {
    $rootScope.value = value;

    const template = '<grr-timestamp-seconds value="value" />';
    const element = $compile(template)($rootScope);
    $rootScope.$apply();

    return element;
  };

  it('does not show anything when value is undefined', () => {
    const element = renderTestTemplate(undefined);
    expect(element.text().trim()).toBe('');
  });

  it('does not show anything when value is null', () => {
    const element = renderTestTemplate(null);
    expect(element.text().trim()).toBe('-');
  });

  it('shows "-" when value is 0', () => {
    const element = renderTestTemplate(0);
    expect(element.text().trim()).toBe('-');
  });

  it('shows integer value', () => {
    const element = renderTestTemplate(42);
    expect(element.text()).toContain('1970-01-01 00:00:42');
  });

  it('shows value with type information', () => {
    const timestamp = {
      'mro': [
        'RDFDatetimeSeconds', 'RDFDatetime', 'RDFInteger', 'RDFString',
        'RDFBytes', 'RDFValue', 'object'
      ],
      'value': 42,
      'age': 0,
      'type': 'RDFDatetimeSeconds',
    };
    const element = renderTestTemplate(timestamp);
    expect(element.text()).toContain('1970-01-01 00:00:42');
  });

  it('includes a human-readable diff when hovered', () => {
    function assertTimestampRendersDiff(timestamp, diff) {
      const element = renderTestTemplate(timestamp);
      const span = $(element).find('span');

      // Simulate a mouseenter event on the span.
      // Doing a mouseenter on the parent directive would not work, as the
      // events bubble outwards towards the parent hierarchy, and the span
      // would not see // this event, so the controller wouldn't capture it.
      browserTriggerEvent($(element).find('span'), 'mouseenter');

      expect(span.attr('title')).toContain(diff);
    }

    const now = (new Date() - 0) / MILLI_IN_UNIT;

    // ignore very small differences from the current time
    assertTimestampRendersDiff(now, 'now');
  });
});


exports = {};
