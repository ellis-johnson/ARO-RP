import { Component } from "react"
import { OverviewComponent } from './ClusterDetailListComponents/Overview';
import { NodesComponent } from './ClusterDetailListComponents/Nodes';

interface ClusterDetailComponentProps {
  item: any
  clusterName: string
  detailPanelSelected: string
}

interface IClusterDetailComponentState {
  item: IClusterDetails // why both state and props?
  detailPanelSelected: string
}

export interface IClusterDetails {
  apiServerVisibility: string
  apiServerURL: string
  architectureVersion: string
  consoleLink: string
  createdAt: string
  createdBy: string
  failedProvisioningState: string
  infraId: string
  lastAdminUpdateError: string
  lastModifiedAt: string
  lastModifiedBy: string
  lastProvisioningState: string
  location: string
  name: string
  provisioningState: string
  resourceId: string
  version: string
  installStatus: string
}

export class ClusterDetailComponent extends Component<ClusterDetailComponentProps, IClusterDetailComponentState> {

  constructor(props: ClusterDetailComponentProps | Readonly<ClusterDetailComponentProps>) {
    super(props);
  }

  public render() {
    switch (this.props.detailPanelSelected.toLowerCase()) {
      case "overview":
      {
        return (
          <OverviewComponent item={this.props.item} clusterName={this.props.clusterName}/>
        )
      }
      case "nodes":
        {
          return (
            <NodesComponent item={this.props.item} clusterName={this.props.clusterName}/>
          );
        }    }
  }
};
