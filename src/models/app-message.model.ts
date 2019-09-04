export class AppMessageModel {
  message = '';
  messageIcon = '';

  constructor(private msg: string, messageIcon: string) {
    this.message = msg;
    if (messageIcon === 'success') {
      this.messageIcon = '';
    } else if (messageIcon === 'info') {
      this.messageIcon = '';
    } else if (messageIcon === 'warn') {
      this.messageIcon = '';
    } else if (messageIcon === 'error') {
      this.messageIcon = '';
    } else {
      this.messageIcon = 'info_circle';
    }
  }
}
