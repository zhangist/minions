import * as React from "react";
import AppWindow from "../../components/AppWindow";

enum UploadState {
  Uploading = "Uploading",
  UploadSuccess = "UploadSuccess",
  UploadFailed = "UploadFailed",
}

interface IUploadBoxState {
  showUploadBox: boolean;
  uploadState?: UploadState;
  uploadUrl: string;
  uploadFile: any;
  windows: any[];
}

export default class UploadBox extends AppWindow<{}, IUploadBoxState> {
  public state: IUploadBoxState = {
    showUploadBox: false,
    uploadState: undefined,
    uploadUrl: "http://localhost:1992/upload",
    uploadFile: null,
    windows: [],
  };

  public render() {
    return (
      <div>
        <button
          onClick={() =>
            this.setState({ showUploadBox: !this.state.showUploadBox })
          }
        >
          Open Upload Box
        </button>
        {this.state.showUploadBox ? (
          <div>
            <input
              value={this.state.uploadUrl}
              onChange={this.handleUploadUrlChange}
            />
            <form
              method="post"
              action={this.state.uploadUrl}
              encType="multipart/form-data"
            >
              <input
                name="file"
                type="file"
                onChange={this.handleUploadFileChange}
              />
              <input type="button" value="Submit" onClick={this.uploadSubmit} />
            </form>
            <span>{this.state.uploadState}</span>
          </div>
        ) : null}
      </div>
    );
  }

  private uploadSubmit = () => {
    if (this.state.uploadFile) {
      this.setState(
        {
          uploadState: UploadState.Uploading,
        },
        () => {
          const data = new FormData();
          data.append("file", this.state.uploadFile);
          const options: RequestInit = {
            method: "post",
            body: data,
          };
          fetch(this.state.uploadUrl, options).then(response => {
            console.log(response);
            let uploadState: UploadState;
            if (response.ok) {
              uploadState = UploadState.UploadSuccess;
            } else {
              uploadState = UploadState.UploadFailed;
            }
            this.setState({
              uploadState,
            });
          });
        },
      );
    }
  };

  private handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      uploadFile: e.target.files ? e.target.files[0] : null,
    });
  };

  private handleUploadUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      uploadUrl: e.target.value,
    });
  };
}
