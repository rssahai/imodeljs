/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import * as fs from "fs";
import * as path from "path";
import { GuidString, IModelHubStatus } from "@bentley/bentleyjs-core";
import { Briefcase, BriefcaseQuery, ChangeSet, IModelClient, IModelHubClient, IModelHubClientError } from "@bentley/imodelhub-client";
import { AccessToken, AuthorizedClientRequestContext } from "@bentley/itwin-client";
import { TestUsers } from "@bentley/oidc-signin-tool";
import { RequestType, ResponseBuilder, ScopeType } from "../ResponseBuilder";
import { TestConfig } from "../TestConfig";
import * as utils from "./TestUtils";

function mockGetBriefcaseById(imodelId: GuidString, briefcase: Briefcase) {
  if (!TestConfig.enableMocks)
    return;

  const requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "Briefcase", `${briefcase.briefcaseId!}`);
  const requestResponse = ResponseBuilder.generateGetResponse(briefcase);
  ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Get, requestPath, requestResponse);
}

function mockGetBriefcaseRequest(imodelId: GuidString, briefcase: Briefcase, selectDownloadUrl: boolean, selectApplicationData: boolean) {
  if (!TestConfig.enableMocks)
    return;

  let getRequestUrl: string = `${briefcase.briefcaseId!}?$select=*`;
  if (selectDownloadUrl)
    getRequestUrl += `,FileAccessKey-forward-AccessKey.DownloadURL`;
  if (selectApplicationData)
    getRequestUrl += `,CreatedByApplication-forward-Application.*`;

  const requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "Briefcase", getRequestUrl);
  if (selectDownloadUrl) {
    briefcase.downloadUrl = "https://imodelhubqasa01.blob.core.windows.net/imodelhubfile";
    briefcase.fileName = "TestModel.bim";
    briefcase.fileSize = utils.getMockFileSize();
  }
  if (selectApplicationData) {
    briefcase.applicationId = `testApplicationId`;
    briefcase.applicationName = `testApplicationName`;
  }

  const requestResponse = ResponseBuilder.generateGetResponse<Briefcase>(briefcase);
  ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Get, requestPath, requestResponse);
}

function mockUpdateBriefcase(imodelId: GuidString, briefcase: Briefcase) {
  if (!TestConfig.enableMocks)
    return;

  const requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "Briefcase", `${briefcase.briefcaseId!}`);
  const requestResponse = ResponseBuilder.generatePostResponse(briefcase);
  ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Post, requestPath, requestResponse);
}

function mockDeleteBriefcase(imodelId: GuidString, briefcaseId: number) {
  if (!TestConfig.enableMocks)
    return;

  const requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "Briefcase", briefcaseId.toString());
  ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Delete, requestPath, {});
}

describe("iModelHub BriefcaseHandler", () => {
  let requestContext: AuthorizedClientRequestContext;
  let imodelId: GuidString;
  let iModelClient: IModelClient;
  const imodelName = "imodeljs-clients Briefcases test";
  let briefcaseId: number;
  let acquiredBriefcaseId: number;

  before(async function () {
    this.enableTimeouts(false);
    const accessToken: AccessToken = TestConfig.enableMocks ? new utils.MockAccessToken() : await utils.login(TestUsers.super);
    requestContext = new AuthorizedClientRequestContext(accessToken);
    (requestContext as any).activityId = "iModelHub BriefcaseHandler";

    await utils.createIModel(requestContext, imodelName);
    imodelId = await utils.getIModelId(requestContext, imodelName);
    iModelClient = utils.getDefaultClient();
    if (!TestConfig.enableMocks) {
      const briefcases = await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().ownedByMe());
      let briefcasesCount = briefcases.length;
      if (briefcasesCount > 18) {
        // Ensure that tests can still acquire briefcases
        for (const briefcase of briefcases) {
          await iModelClient.briefcases.delete(requestContext, imodelId, briefcase.briefcaseId!);
        }
        briefcasesCount = 0;
      }

      // Ensure that at least one briefcase is available for querying
      if (briefcasesCount === 0) {
        const briefcase = await iModelClient.briefcases.create(requestContext, imodelId);
        briefcaseId = briefcase.briefcaseId!;
      } else {
        briefcaseId = briefcases[0].briefcaseId!;
      }
    } else {
      briefcaseId = 2;
    }

    if (!fs.existsSync(utils.workDir)) {
      fs.mkdirSync(utils.workDir);
    }
  });

  afterEach(() => {
    ResponseBuilder.clearMocks();
  });

  it("should acquire a briefcase (#iModelBank)", async () => {
    utils.mockCreateBriefcase(imodelId, 3);
    const briefcase = await iModelClient.briefcases.create(requestContext, imodelId);
    chai.expect(briefcase.briefcaseId).to.be.greaterThan(1);
    acquiredBriefcaseId = briefcase.briefcaseId!;
  });

  it("should get all briefcases (#iModelBank)", async () => {
    utils.mockGetBriefcase(imodelId, utils.generateBriefcase(2), utils.generateBriefcase(3));
    const briefcases = await iModelClient.briefcases.get(requestContext, imodelId);
    chai.expect(briefcases.length).to.be.greaterThan(0);

    for (const briefcase of briefcases) {
      chai.assert(briefcase.iModelId);
      chai.expect(briefcase.iModelId!.toString()).to.be.equal(imodelId.toString());
    }
  });

  it("should delete a briefcase (#iModelBank)", async () => {
    utils.mockGetBriefcase(imodelId, utils.generateBriefcase(2), utils.generateBriefcase(acquiredBriefcaseId));
    const originalBriefcaseCount = (await iModelClient.briefcases.get(requestContext, imodelId)).length;

    mockDeleteBriefcase(imodelId, acquiredBriefcaseId);
    await iModelClient.briefcases.delete(requestContext, imodelId, acquiredBriefcaseId);

    utils.mockGetBriefcase(imodelId, utils.generateBriefcase(2));
    const briefcaseCount = (await iModelClient.briefcases.get(requestContext, imodelId)).length;

    chai.expect(briefcaseCount).to.be.lessThan(originalBriefcaseCount);
  });

  it("should fail getting an invalid briefcase (#iModelBank)", async () => {
    let error: any;
    try {
      await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(-1));
    } catch (err) {
      error = err;
    }
    chai.assert(error);
    chai.expect(error).to.be.instanceof(IModelHubClientError);
    chai.expect(error.errorNumber).to.be.equal(IModelHubStatus.InvalidArgumentError);
  });

  it("should get information on a briefcase by id (#iModelBank)", async () => {
    mockGetBriefcaseById(imodelId, utils.generateBriefcase(briefcaseId));
    const briefcase: Briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcaseId)))[0];
    chai.expect(briefcase.briefcaseId).to.be.equal(briefcaseId);
    chai.expect(briefcase.downloadUrl).to.be.equal(undefined);
    chai.assert(briefcase.iModelId);
    chai.expect(briefcase.iModelId!.toString()).to.be.equal(imodelId.toString());
  });

  it("should fail deleting an invalid briefcase (#iModelBank)", async () => {
    let error: any;
    try {
      await iModelClient.briefcases.delete(requestContext, imodelId, -1);
    } catch (err) {
      error = err;
    }
    chai.assert(error);
    chai.expect(error).to.be.instanceof(IModelHubClientError);
    chai.expect(error.errorNumber).to.be.equal(IModelHubStatus.InvalidArgumentError);
  });

  it("should get the download URL for a Briefcase (#iModelBank)", async () => {
    mockGetBriefcaseRequest(imodelId, utils.generateBriefcase(briefcaseId), true, false);
    const briefcase: Briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcaseId).selectDownloadUrl()))[0];
    chai.expect(briefcase.briefcaseId).to.be.equal(briefcaseId);
    chai.assert(briefcase.fileName);
    chai.expect(briefcase.fileName!.length).to.be.greaterThan(0);
    chai.assert(briefcase.downloadUrl);
    utils.expectMatchesExpectedUrlScheme(briefcase.downloadUrl);
  });

  it("should get the application data for a Briefcase", async () => {
    mockGetBriefcaseRequest(imodelId, utils.generateBriefcase(briefcaseId), false, true);
    const briefcase: Briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcaseId).selectApplicationData()))[0];
    chai.expect(briefcase.briefcaseId).to.be.equal(briefcaseId);

    if (TestConfig.enableMocks) {
      chai.assert(briefcase.applicationId);
      chai.expect(briefcase.applicationId).equals("testApplicationId");
      chai.assert(briefcase.applicationName);
      chai.expect(briefcase.applicationName).equals("testApplicationName");
    }
  });

  it("should get the application data and download URL for a Briefcase", async () => {
    mockGetBriefcaseRequest(imodelId, utils.generateBriefcase(briefcaseId), true, true);
    const briefcase: Briefcase = (await iModelClient.briefcases.get(requestContext, imodelId,
      new BriefcaseQuery().byId(briefcaseId).selectDownloadUrl().selectApplicationData()))[0];
    chai.expect(briefcase.briefcaseId).to.be.equal(briefcaseId);

    chai.assert(briefcase.fileName);
    chai.expect(briefcase.fileName!.length).to.be.greaterThan(0);
    chai.assert(briefcase.downloadUrl);
    chai.assert(briefcase.downloadUrl!.startsWith("https://"));

    if (TestConfig.enableMocks) {
      chai.assert(briefcase.applicationId);
      chai.expect(briefcase.applicationId).equals("testApplicationId");
      chai.assert(briefcase.applicationName);
      chai.expect(briefcase.applicationName).equals("testApplicationName");
    }
  });

  it("should get and extend briefcase expiration date", async () => {
    const currentDate = new Date().getDate();
    const dateAfter30Days = new Date().setDate(currentDate + 30);
    const dateAfter31Days = new Date().setDate(currentDate + 31);

    let briefcase: Briefcase = utils.generateBriefcase(briefcaseId);
    briefcase.acquiredDate = new Date().toISOString();
    briefcase.expirationDate = new Date(dateAfter30Days).toISOString();

    mockGetBriefcaseById(imodelId, briefcase);
    briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcase.briefcaseId!)))[0];
    chai.expect(Date.parse(briefcase.expirationDate!)).to.be.within(Date.parse(briefcase.acquiredDate!), dateAfter30Days);

    mockUpdateBriefcase(imodelId, briefcase);
    briefcase = await iModelClient.briefcases.update(requestContext, imodelId, briefcase);
    chai.expect(Date.parse(briefcase.expirationDate!)).to.be.within(dateAfter30Days, dateAfter31Days);
  });

  it("should get and set briefcase DeviceName and ChangeSetIdOnDevice", async () => {
    // DeviceName can be set when acquiring a briefcase
    let deviceName = "iModeljsBriefcasesTest";
    let briefcase: Briefcase = utils.generateBriefcase(briefcaseId);
    briefcase.deviceName = deviceName;
    utils.mockCreateBriefcase(imodelId, undefined, briefcase);
    briefcase = await iModelClient.briefcases.create(requestContext, imodelId, briefcase);

    mockGetBriefcaseById(imodelId, briefcase);
    briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcase.briefcaseId!)))[0];
    chai.expect(briefcase.deviceName).to.be.equals(deviceName);
    chai.expect(briefcase.changeSetIdOnDevice).to.be.equals(undefined);

    // DeviceName can be changed and ChangeSetIdOnDevice can be set when extending a briefcase
    const changeSet: ChangeSet = (await utils.createChangeSets(requestContext, imodelId, briefcase, 0, 1))[0];
    deviceName += briefcase.briefcaseId;
    briefcase.deviceName = deviceName;
    briefcase.changeSetIdOnDevice = changeSet.id;
    mockUpdateBriefcase(imodelId, briefcase);
    briefcase = await iModelClient.briefcases.update(requestContext, imodelId, briefcase);

    mockGetBriefcaseById(imodelId, briefcase);
    briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcase.briefcaseId!)))[0];
    chai.expect(briefcase.deviceName).to.be.equals(deviceName);
    chai.expect(briefcase.changeSetIdOnDevice).to.be.equals(changeSet.id);
  });

  it("should download a Briefcase (#iModelBank)", async () => {
    mockGetBriefcaseRequest(imodelId, utils.generateBriefcase(briefcaseId), true, false);
    const briefcase: Briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcaseId).selectDownloadUrl()))[0];
    chai.assert(briefcase.downloadUrl);

    const fileName: string = briefcase.fileName!;
    const downloadToPathname: string = path.join(utils.workDir, fileName);

    utils.mockFileResponse();

    const progressTracker = new utils.ProgressTracker();
    await iModelClient.briefcases.download(requestContext, briefcase, downloadToPathname, progressTracker.track());
    progressTracker.check();
    fs.existsSync(downloadToPathname).should.be.equal(true);
  });

  it("should download a Briefcase with Buffering (#iModelBank)", async () => {
    iModelClient.setFileHandler(utils.createFileHandler(true));
    mockGetBriefcaseRequest(imodelId, utils.generateBriefcase(briefcaseId), true, false);
    const briefcase: Briefcase = (await iModelClient.briefcases.get(requestContext, imodelId, new BriefcaseQuery().byId(briefcaseId).selectDownloadUrl()))[0];
    chai.assert(briefcase.downloadUrl);

    const fileName: string = briefcase.fileName!;
    const downloadToPathname: string = path.join(utils.workDir, fileName);

    utils.mockFileResponse();

    const progressTracker = new utils.ProgressTracker();
    await iModelClient.briefcases.download(requestContext, briefcase, downloadToPathname, progressTracker.track());
    progressTracker.check();
    fs.existsSync(downloadToPathname).should.be.equal(true);

    iModelClient.setFileHandler(utils.createFileHandler());
  });

  it("should get error 409 and fail to get briefcase (#unit)", async () => {
    const requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "Briefcase");
    ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Get, requestPath, ResponseBuilder.generateError("NoServerLicense"), 1, undefined, undefined, 409);
    let error;
    try {
      (await iModelClient.briefcases.get(requestContext, imodelId));
    } catch (err) {
      error = err;
    }
    chai.assert(error);
    chai.expect(error.status).to.be.equal(409);
    chai.expect(error.name).to.be.equal("NoServerLicense");
  });

  it("should get error 500 and retry to get briefcase (#unit)", async () => {
    const requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "Briefcase");
    ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Get, requestPath, ResponseBuilder.generateError(undefined, "ServerError"), 5, undefined, undefined, 500);
    let error;
    try {
      (await iModelClient.briefcases.get(requestContext, imodelId));
    } catch (err) {
      error = err;
    }
    chai.assert(error);
    chai.expect(error.status).to.be.equal(500);
  });

  it("should fail downloading briefcase with no file handler (#iModelBank)", async () => {
    let error: IModelHubClientError | undefined;
    const invalidClient = new IModelHubClient();
    try {
      await invalidClient.briefcases.download(requestContext, new Briefcase(), utils.workDir);
    } catch (err) {
      if (err instanceof IModelHubClientError)
        error = err;
    }
    chai.assert(error);
    chai.expect(error!.errorNumber).to.be.equal(IModelHubStatus.FileHandlerNotSet);
  });

  it("should fail downloading briefcase with no file url (#iModelBank)", async () => {
    let error: IModelHubClientError | undefined;
    try {
      await iModelClient.briefcases.download(requestContext, new Briefcase(), utils.workDir);
    } catch (err) {
      if (err instanceof IModelHubClientError)
        error = err;
    }
    chai.assert(error);
    chai.expect(error!.errorNumber).to.be.equal(IModelHubStatus.MissingDownloadUrlError);
  });
});
