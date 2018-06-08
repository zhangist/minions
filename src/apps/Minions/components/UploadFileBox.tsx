import * as React from "react";
import AppWindow from "../../../components/AppWindow";

enum UploadState {
  Uploading = "Uploading",
  UploadSuccess = "UploadSuccess",
  UploadFailed = "UploadFailed",
}

interface State {
  isShowUploadFileBox: boolean;
  uploadState?: UploadState;
  uploadUrl: string;
  uploadFile: any;
  windows: any[];
}

export default class UploadFileBox extends AppWindow<{}, State> {
  public state: State = {
    isShowUploadFileBox: false,
    uploadState: undefined,
    uploadUrl: "http://localhost:1992/upload",
    uploadFile: null,
    windows: [],
  };

  public render() {
    const { isShowUploadFileBox, uploadUrl, uploadState } = this.state;

    return (
      <div>
        <button
          onClick={() =>
            this.setState({ isShowUploadFileBox: !isShowUploadFileBox })
          }
        >
          Open Upload Box
        </button>
        {isShowUploadFileBox && (
          <div>
            <input value={uploadUrl} onChange={this.handleUploadUrlChange} />
            <form
              method="post"
              action={uploadUrl}
              encType="multipart/form-data"
            >
              <input
                name="file"
                type="file"
                onChange={this.handleUploadFileChange}
              />
              <input type="button" value="Submit" onClick={this.uploadSubmit} />
            </form>
            <span>{uploadState}</span>
          </div>
        )}
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
