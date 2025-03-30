// types/custom.d.ts
import 'react';

declare namespace JSX {
  interface IntrinsicElements {
    'langflow-chat': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'window_title'?: string;
        'flow_id'?: string;
        'host_url'?: string;
      },
      HTMLElement
    >;
  }
}