import { Component } from "react"
import { Stack, Text, mergeStyleSets, IColumn, IDetailsListStyles, TextField, DetailsList, SelectionMode, DetailsListLayoutMode, StackItem, Toggle, Fabric, Pivot, PivotItem, Label, Shimmer, IStackItemStyles, DefaultPalette, } from '@fluentui/react';
import { ICondition, INode, INodeOverviewDetails, IResourceUsage, ITaint, IVolume} from "./NodesWrapper";
import { useBoolean } from '@fluentui/react-hooks';
import { contentStackStylesNormal } from "../App";
import { KeyStyle, ValueStyle, ValueColumnStyle, KeyColumnStyle, headShimmerStyle, headerShimmer, rowShimmer, ShimmerStyle } from '../ClusterDetailListComponents/Overview';

interface NodesComponentProps {
    nodes: any
    clusterName: string
}

const stackItemStyles: IStackItemStyles = {
    root: {
      width: "45%",
    },
  };

const NodeOverviewDetails: INodeOverviewDetails = {
    createdTime: 'Created Time'
  }
  
  const ResourceDetails: IResourceUsage = {
    CPU: "CPU",
    Memory: "Memory",
    StorageVolume: "Storage Volume",
    Pods: "Pods"
  }
  
  const ConditionDetails: ICondition = {
    status: "Status",
    lastHeartbeatTime: "Last Heartbeat Time",
    lastTransitionTime: "Last Transition Time",
    message: "Message"
  }

  const TaintDetails: ITaint = {
      key: "Key"
  }

const VolumeDetails: IVolume = {
    Path: "Device Path"
}

interface INodesState {
nodes: INode[]
}

function Column(
    value: any,
    ): any {
        if (typeof (value.value) == typeof (" ")) {
            return <Stack.Item styles={value.style}>
                      <Text styles={value.style} variant={'medium'}>{value.value}</Text>
                   </Stack.Item>
        }
    };

const InfoList = (
    props: {headers: any, object: any, title: string, titleSize: any}
) => {
    var headerEntries = Object.entries(props.headers)
    var filteredHeaders: Array<[string, any]> = []
    headerEntries.filter((element: [string, any]) => {
        if (props.object[element[0]] != null &&
            props.object[element[0]].toString().length > 0) {
                filteredHeaders.push(element)
            }
    })
    return (
        <Stack styles={contentStackStylesNormal}>
            <Text variant={props.titleSize}>{props.title}</Text>
            <Stack horizontal>
                <Stack styles={KeyColumnStyle}>
                {filteredHeaders.map((value: [string, any], index: number) => (
                    <Column style={KeyStyle} key={index} value={value[1]} />
                    )
                )}
                </Stack>
                
                <Stack styles={KeyColumnStyle}>
                {Array(filteredHeaders.length).fill(':').map((value: [string], index: number) => (
                    <Column style={KeyStyle} key={index} value={value} />
                    )
                )}
                </Stack>
                
                <Stack styles={ValueColumnStyle}>
                {filteredHeaders.map((value: [string, any], index: number) => (
                    <Column style={ValueStyle}
                    key={index}
                    value={props.object[value[0]]} />
                    )
                )}
                </Stack>
            </Stack>
        </Stack>
    );
}

const MultiInfoList = (
    props: any
) => {
    return props.items.map((item: { [x: string]: any; }) => {
        return <InfoList headers={props.headers} object={item} title={item[props.subProp]} titleSize={item[props.titleSize]}/>
    })
}

const nodeListStyles: Partial<IDetailsListStyles> = {
    headerWrapper: {
        marginTop: "-16px",
    },
}

const HeadersFromStringMap = (items: Map<string,string>) => {
    var newItems: any = {}
    items.forEach((value: string, key: string) => {
        newItems[key] = key
    })

    return newItems
}

const ObjectFromStringMap = (items: Map<string,string>) => {
    var newItems: any = {}
    items.forEach((value: string, key: string) => {
        newItems[key] = value
    })

    return newItems
}

// TODO: Get Styling to look pretty
const renderNodes = (nodes: INode[]) => {
    return nodes.map(node => {
        return <PivotItem headerText={node.name}>
                <Text variant="xLarge">{node.name}</Text>
                <Stack horizontal grow>
                    <Stack styles={stackItemStyles}>
                        <StackItem>
                            <InfoList headers={NodeOverviewDetails} object={node} title="Overview" titleSize="large"/>
                        </StackItem>
                        <StackItem>
                            <InfoList headers={ResourceDetails} object={node.capacity} title="Capacity" titleSize="large"/>
                        </StackItem>
                        <StackItem>
                            <InfoList headers={ResourceDetails} object={node.allocatable} title="Allocatable" titleSize="large"/>
                        </StackItem>
                        <StackItem>
                            <InfoList headers={HeadersFromStringMap(node.labels!)} object={ObjectFromStringMap(node.labels!)} title="Labels" titleSize="large"/>
                        </StackItem>
                    </Stack>
                    <Stack styles={stackItemStyles}>
                        <StackItem>
                            <Text variant="large" styles={contentStackStylesNormal}>Conditions</Text>
                            <MultiInfoList headers={ConditionDetails} items={node.conditions} title="Conditions" subProp="type" titleSize="medium"/>
                        </StackItem>
                        <StackItem>
                            <Text variant="large" styles={contentStackStylesNormal}>Taints</Text>
                            <MultiInfoList headers={TaintDetails} items={node.taints} title="Taints" subProp="effect" titleSize="medium"/>
                        </StackItem>
                        <StackItem>
                            <InfoList headers={HeadersFromStringMap(node.annotations!)} object={ObjectFromStringMap(node.annotations!)} title="Annotations" titleSize="large"/>
                        </StackItem>
                    </Stack>
                    {node.volumes!.length > 0 &&
                        <StackItem>
                            <Text variant="large">Volumes</Text>
                            <MultiInfoList headers={VolumeDetails} items={node.volumes} title="Volumes" subProp="Name" titleSize="medium"/>
                        </StackItem>
                    }
                </Stack>
            </PivotItem>;
    });
};

function PivotOverflowMenuExample(value: any) {
    return (
            <Pivot linkFormat={'tabs'} overflowBehavior={'menu'}>
                {renderNodes(value.nodes)}
            </Pivot>
    );
};
export class NodesComponent extends Component<NodesComponentProps, INodesState> {

    constructor(props: NodesComponentProps) {
        super(props)

        this.state = {
            nodes: this.props.nodes,
        }
    }

    public render() {
        var { nodes } = this.state
        var myStyle = nodeListStyles

        // if ( !this.props.showColumns ) {
        // columns = [columns[0], columns[1]]
        // myStyle = clusterListDetailStylesSmall
        // }

        return (
        <Stack styles={contentStackStylesNormal}>
            <Text variant="xxLarge">{this.props.clusterName}</Text>
            <Stack>
                <PivotOverflowMenuExample nodes={this.state.nodes}/>
            </Stack>
        </Stack>
        )
    }

    private _getKey(item: any, _index?: number): string {
        return item.key
    }

    private _onChangeText = (
        _ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        text?: string
    ): void => {
        this.setState({
        nodes: text
            ? this.props.nodes.filter((i: { name: string; }) => i.name.toLowerCase().indexOf(text) > -1)
            : this.props.nodes,
        })
    }
}
