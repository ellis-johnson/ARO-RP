import { IShimmerStyles, ShimmerElementType } from '@fluentui/react/lib/Shimmer';
import { Component } from "react"
import { Stack, Text, IStackStyles, IStackItemStyles } from '@fluentui/react';
import { contentStackStylesNormal } from "../App"
import { IClusterDetails } from "../ClusterDetailList"

interface NodesComponentProps {
    item: any
    clusterName: string
}

interface INodeComponentState {
    item: IClusterDetails
}

const KeyColumnStyle: Partial<IStackStyles> = {
    root: {
        paddingTop: 10,
        paddingRight: 15,
    }
}

const ValueColumnStyle: Partial<IStackStyles> = {
    root: {
        paddingTop: 10,
    }
}
    
export class NodesComponent extends Component<NodesComponentProps, INodeComponentState> {
    
    constructor(props: NodesComponentProps | Readonly<NodesComponentProps>) {
        super(props);
    }
    
    public render() {
        return (
        <Stack styles={contentStackStylesNormal}>
              <Text variant="xxLarge">{this.props.clusterName}</Text>
              <Stack horizontal>
                <Stack styles={KeyColumnStyle}>
                  Node detail
                </Stack>

                <Stack styles={KeyColumnStyle}>
                  Node detail2
                </Stack>

                <Stack styles={ValueColumnStyle}>
                  Node detail3
                </Stack>
              </Stack>
        </Stack>
        )
    };
}