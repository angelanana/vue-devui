import { defineComponent, onMounted, watch, reactive, ref } from 'vue';
import { rateProps } from './use-rate';
import './rate.scss';

export default defineComponent({
  name: 'DRate',
  props: rateProps,
  emits: ['change', 'update:value'],
  setup(props, ctx) {
    const totalLevelArray = reactive<Record<string, any>[]>([]);
    const chooseValue = ref(0);

    // 根据mouseMove，mouseLeave,select等操作，改变颜色与是否选中
    const setChange = (start: number, end: number, width: string) => {
      for (let i = start; i < end; i++) {
        totalLevelArray[i]['width'] = width;
      }
    };

    // 初始化设置
    const initRating = () => {
      if (!props.value) {
        return;
      }
      chooseValue.value = props.value - 1;
      const halfStar = chooseValue.value % 1;
      const intCurrentLevel = Math.floor(chooseValue.value);
      setChange(0, intCurrentLevel + 1, '100%');
      if (halfStar > 0) {
        totalLevelArray[intCurrentLevel + 1]['width'] = halfStar * 100 + '%';
        setChange(intCurrentLevel + 2, props.count, '0');
      } else {
        setChange(intCurrentLevel + 1, props.count, '0');
      }
    };

    onMounted(() => {
      for (let i = 0; i < props.count; i++) {
        totalLevelArray.push({ width: '0' });
      }
      initRating();
    });

    const hoverToggle = (_, index: number, reset = false) => {
      if (props.read) {
        return;
      }
      if (reset) {
        if (chooseValue.value >= 0) {
          setChange(0, chooseValue.value + 1, '100%');
          setChange(chooseValue.value + 1, props.count, '0');
        } else {
          setChange(0, props.count, '0');
        }
      } else {
        setChange(0, index + 1, '100%');
        setChange(index + 1, props.count, '0');
      }
    };

    const selectValue = (index: number) => {
      if (props.read) {
        return;
      }
      setChange(0, index + 1, '100%');
      setChange(index + 1, props.count, '0');
      chooseValue.value = index;
      props.onChange && props.onChange(index + 1);
      props.onTouched && props.onTouched();
      ctx.emit('update:value', index + 1);
    };
    return {
      totalLevelArray,
      chooseValue,
      hoverToggle,
      selectValue,
    };
  },
  render() {
    const {
      totalLevelArray,
      chooseValue,
      icon,
      character,
      read,
      type,
      color,
      hoverToggle,
      selectValue,
    } = this;
    return (
      <div
        class="devui-star-container"
        onMouseleave={(e) => hoverToggle(e, chooseValue, true)}
      >
        {totalLevelArray.map((item, index) => (
          <div
            class={`devui-star-align devui-pointer ${
              read ? 'devui-only-read' : ''
            }`}
            key={index}
            onMouseover={(e) => hoverToggle(e, index)}
            onClick={() => selectValue(index)}
          >
            <span class={`devui-star-color ${icon}`}>
              {character}
              {!icon && !character && (
                <svg
                  width="16px"
                  height="16px"
                  viewBox="0 0 16 16"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns-xlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g fill="#E3E5E9" id="Mask">
                      <polygon points="8 12.7603585 3.67376208 14.3147912 3.81523437 9.71994835 1 6.0857977 5.41367261 4.80046131 8 1 10.5863274 4.80046131 15 6.0857977 12.1847656 9.71994835 12.3262379 14.3147912"></polygon>
                    </g>
                  </g>
                </svg>
              )}
            </span>
            <span
              class={`devui-star-color-active devui-active-star devui-star-color-${type} ${icon}`}
              style={{ color: color, width: item.width }}
            >
              {character}
              {!icon && !character && (
                <svg
                  width="16px"
                  height="16px"
                  viewBox="0 0 16 16"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns-xlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g id="Mask">
                      <polygon points="8 12.7603585 3.67376208 14.3147912 3.81523437 9.71994835 1 6.0857977 5.41367261 4.80046131 8 1 10.5863274 4.80046131 15 6.0857977 12.1847656 9.71994835 12.3262379 14.3147912"></polygon>
                    </g>
                  </g>
                </svg>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  },
});