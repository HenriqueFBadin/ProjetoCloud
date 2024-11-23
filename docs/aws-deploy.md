# Deploy da aplicação no AWS

Para acessar a API restful que foi implementada na AWS você pode acessar o seguinte link: [aqui](http://ac815a5754c5f4c00a2d160a0dacc9bc-392542149.us-east-2.elb.amazonaws.com). Por aqui você pode acessar o swagger da API, que é uma representação visual dos endpoints, e ver exemplos de como devem ser os parâmetros. Entretanto, o swagger está com algum problema de CORS que eu não consegui resolver, então eu recomendaria a utilização do postman ou a utilização de chamadas CUrl para testar os endpoints da API. As instruções de como fazer isso estão no final dessa documentação, apenas garanta que está utilizando o seguinte link: [aqui](http://ac815a5754c5f4c00a2d160a0dacc9bc-392542149.us-east-2.elb.amazonaws.com).

A aplicação foi configurada para operar em um cluster do Elastic Kubernetes Service (EKS) na região de Ohio da AWS, garantindo escalabilidade e gerenciamento eficiente de containers. Para acessar a aplicação, basta acessar o link acima. A aplicação foi dividida em dois deployments, um para a base de dados e outro para a aplicação. A base de dados é um container com uma imagem do postgres e a aplicação é um container com uma imagem de uma aplicação em NodeJS.

## Como foi feito o deploy do projeto na AWS?

A partir daqui, este documento descreve as etapas que foram necessárias para criar e configurar um cluster EKS (Elastic Kubernetes Service) na AWS utilizando a AWS CLI. Cada etapa será explicada em detalhes, incluindo o motivo de sua realização. O objetivo é ajudar a configurar e gerenciar um cluster Kubernetes para hospedar aplicações modernas.

1.  **Instalação do CLI da AWS**:

    O AWS CLI é uma ferramenta de linha de comando que permite interagir com os serviços da AWS.Para instalar o AWS CLI, as instruções presentes no site [aqui](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) foram usadas como referência.

2.  **Configuração do AWS CLI**:

    Após a instalação do AWS CLI, foi necessário configurar o acesso à sua conta da AWS. Para configurar o AWS CLI, foi utilizada como base a seguinte documentação [aqui](https://docs.aws.amazon.com/pt_br/eks/latest/userguide/install-awscli.html).

    2.1. **Criar uma chave de acesso**: Para configurar o AWS CLI, é necessário criar uma chave de acesso na AWS. Para isso os seguintes passos foram seguidos:

    - Faça login no AWS Management Console

      > Conta de usuário único:

      - no canto superior direito, escolha seu nome de usuário da AWS para abrir o menu de navegação. Para este exemplo, selecione webadmin.

      > Conta de vários usuários:

      - Escolha IAM na lista de serviços. No painel do IAM, selecione Usuários e escolha o nome do usuário.
      - Selecione Security credentials (Credenciais de segurança).
      - Em Chaves de acesso, escolha Criar chave de acesso.
      - Escolha Interface de linha de comandos (CLI) e, em seguida, escolha Próximo.
      - Selecione Create access key (Criar chave de acesso).
      - Selecione Download do arquivo .csv para salvar a chave de acesso CSV no seu computador. Armazene o arquivo em um local seguro. Você não pode compartilhar essas informações na web.

        2.2. **Para configurar a AWS CLI**:

      Para configurar a AWS CLI, os seguintes passos foram seguidos:

      - Abra um terminal.
      - Execute o comando `aws configure`.
      - Forneça as seguintes informações:
        - **AWS Access Key ID**: Chave de acesso da AWS.
        - **AWS Secret Access Key**: Chave secreta de acesso da AWS.
        - **Default region name**: Região padrão para os serviços da AWS.
        - **Default output format**: Formato de saída padrão para os comandos da AWS.

3.  **Instalação do EKSCTL**:

    O eksctl é uma ferramenta de linha de comando que simplifica a criação, a configuração e a gestão de clusters do EKS. Para instalar o eksctl, as instruções presentes no site [aqui](https://eksctl.io/installation/) foram usadas como referência. A ferramenta foi instalada no sistema operacional a partir de Third-Parties. Em resumo, os seguintes comandos foram executados no powershell:

    <div class="terminal">choco install eksctl</div>

    ⚠️ Observação: Esse comando precisa que o powershell tenha permissão de administrador.

4.  **Criação da Role a ser utilizada**:

    Uma role atribui permissões a uma entidade, permitindo-a acessar recursos e controlar ações na AWS. Para criar uma role, foi necessário entrar na aba de funções do IAM da AWS:

    ![Página de criação de roles](./PaginaDeRoles.png)

    - A primeira role criada foi para o cluster, e possuia apenas a permissão [AmazonEKSClusterPolicy](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-2#/roles/details/EksClusterRoleApp?section=permissions). Como é possível ver na descrição desta política concede ao Kubernetes as permissões necessárias para gerenciar recursos em seu nome, incluindo a permissão Ec2:CreateTags para adicionar informações de identificação a recursos da EC2, como instâncias, grupos de segurança e interfaces de rede elástica.

    - A segunda role criada foi destinada ao **Node Group**. Essa role permite ao Amazon EKS gerenciar os serviços relacionados ao cluster. Contudo, para interações com outros serviços da AWS, podem ser necessários novos profiles com roles específicas, que devem ser criadas conforme as funções do Node Group.

    Nesta role, foram adicionadas duas políticas principais: [AmazonEKSWorkerNodePolicy](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-2#/policies/details/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAmazonEKSWorkerNodePolicy?section=permissions) e [AmazonEKS_CNI_Policy](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-2#/policies/details/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAmazonEKS_CNI_Policy?section=permissions).

        - AmazonEKSWorkerNodePolicy: Concede aos nós de trabalho do EKS as permissões necessárias para operar e interagir com o cluster.
        - AmazonEKS_CNI_Policy: Permite ao Amazon VPC CNI Plugin gerenciar a configuração de endereços IP, incluindo listar, descrever e modificar Elastic Network Interfaces (ENIs).

    Essas permissões garantem uma comunicação eficiente e uma integração adequada entre os nós de trabalho e o cluster EKS.

5.  **Criação da VPC e subnets**:

    Para a criação da VPC utilizou-se um modelo pronto da AWS para criar subnets públicas e privadas de forma organizada, usando o CloudFormation (no caso, no formato Terraform para a AWS). A ideia é separar os recursos que precisam de acesso público daqueles que devem ficar em uma área mais protegida, sem acesso direto à internet.

    Com as subnets configuradas, também defini como as máquinas EC2 vão ser criadas. A diferença entre as subnets públicas e privadas é bem importante:

    Subnets Públicas: São para coisas que precisam acessar ou ser acessadas pela internet, tipo servidores web ou balanceadores de carga.
    Subnets Privadas: Ficam para os recursos mais internos, como bancos de dados ou sistemas de backend, que não podem ficar expostos diretamente.
    Essa configuração ajuda a deixar o ambiente mais seguro e também facilita a organização e o crescimento da infraestrutura, mesmo que seja algo simples agora.

    Foto da estrutura de rede gerada pela AWS:

    ![Foto da estrutura de rede gerada pela AWS](./estruturaRede.png)

    <a href="https://raw.githubusercontent.com/HenriqueFBadin/ProjetoCloud/main/amazon-eks-vpc-private-subnets.yml" id="download-vpc">
    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
    Baixar o modelo de criação da VPC
    </button>
    </a>

6.  **Criação do cluster**:

    Criou-se o cluster passando para ele qual a role que usaria e qual a especificação de vpc usada. Ambas, a role e as especificações da vpc, são as criadas nos passos anteriores.

    ![Página de criação de clusters](./criaçãoDeClusters.png)
    ![Role do clusters](./RoleDoCluster.png)
    ![Criação de clusters](./CriacaoDoCluster.png)
    ![Criação de clusters 2](./CriacaoDoCluster2.png)

7.  **Configurar o Contexto do Kubectl**:

    Após criar o cluster, foi configrado o contexto do `kubectl` para se conectar ao cluster EKS:

    <div class="terminal">aws eks --region us-east-2 update-kubeconfig --name eks-app-NASA</div>

    Este comando atualiza o arquivo de configuração `kubeconfig` para permitir que o `kubectl` se comunique com o cluster recém-criado. É uma etapa essencial para gerenciar os recursos do Kubernetes no cluster.

8.  **Criação do Node Group**:

    Criou-se um node group dentro do cluster para gerenciar os nós de trabalho. O node group é um conjunto de 2 instâncias EC2 que são usadas para executar os pods da aplicação, 1 para o db e outra para a API. Utilizou-se a role criado anteriormente para o node group.

9.  **Criação do Arquivo db-deployment.yaml**:

    Criou-se um arquivo `db-deployment.yaml` com as configurações do deployment para a base de dados.

    Ele pode ser baixado aqui caso queira usá-lo como exemplo:

    <a href="https://raw.githubusercontent.com/HenriqueFBadin/ProjetoCloud/main/db-deployment.yml" id="download-db">
    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
    Baixar db-deployment.yml
    </button>
    </a>

10. **Criação do Arquivo web-deployment.yaml**:

    Criou-se um arquivo `web-deployment.yaml` com as configurações do deployment para a base de dados.

    Ele pode ser baixado aqui caso queira usá-lo como exemplo:

    <a href="https://raw.githubusercontent.com/HenriqueFBadin/ProjetoCloud/main/web-deployment.yml" id="download-web">
    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
    Baixar web-deployment.yml
    </button>
    </a>

11. **Deployment dos clusters**:

    Execute os comandos abaixo para realizar o deployment do banco de dados e da aplicação web:

    <div class="terminal">kubectl apply -f db-deployment.yaml
    kubectl apply -f web-deployment.yaml
    </div>

12. **Verificando status dos deployments**:

    Para encontrar possíveis erros, é importante verificar o status dos deployments. Alguns comandos úteis são:

    - `kubectl describe deployment <deployment-name>`: Mostra informações detalhadas sobre um deployment.

    <div class="terminal">kubectl describe deployment nodejs</div>

    - `kubectl get all`: Mostra todos os recursos do cluster.

    <div class="terminal">kubectl get all</div>

    - `kubectl get pods`: Mostra todos os pods do cluster.

    <div class="terminal">kubectl get pods</div>

    - `kubectl logs <pod-name>`: Mostra os logs de um pod específico.

    <div class="terminal">kubectl logs nodejs-app-5d5d55f889-p86q8</div>

13. **Obtendo o link da aplicação**:

    Para obter o link da aplicação, foi utilizado o comando abaixo:

    <div class="terminal">kubectl get svc nodejs-app</div>

    Este comando exibe informações sobre o serviço, incluindo o endereço IP ou URL que pode ser usado para acessar a aplicação.

## Como testar a aplicação?

Para testar a aplicação, você pode acessar o link da aplicação que foi obtido no passo anterior.

Com esse link, podemos utilizar o postman ou realizarmos chamadas CUrl para testar os endpoints da API. A seguir, temos um exemplo de como realizar uma chamada CUrl para os endpoints da API usando o powershell, mude os valores para testar os endpoints da API:

- Registro:

```bash
curl -X POST "http://ac815a5754c5f4c00a2d160a0dacc9bc-392542149.us-east-2.elb.amazonaws.com/registrar" -H "Content-Type: application/json" -d '{"nome": "testando", "email": "testePadrao@gmail.com", "senha": "teste"}'
```

- Login:

```bash
curl -X POST "http://ac815a5754c5f4c00a2d160a0dacc9bc-392542149.us-east-2.elb.amazonaws.com/login" -H "Content-Type: application/json" -d '{"email": "testePadrao@gmail.com", "senha": "teste"}'
```

- Consultar imagem:

```bash
Invoke-RestMethod -Uri 'http://ac815a5754c5f4c00a2d160a0dacc9bc-392542149.us-east-2.elb.amazonaws.com/consultar' -Method GET -Headers @{ "Content-Type" = "application/json"; "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibm9tZSI6InRlc3RlMTgxMSIsImVtYWlsIjoidGVzdGUxODExQGdtYWlsLmNvbSIsImlhdCI6MTczMjE2NzMyNSwiZXhwIjoxNzMyMTcwOTI1fQ.xRChB16g7PrmogMNRTvcN3cZ6PV85rtO6GOveCZ6rIE" } -Body '{"email": "testePadrao@gmail.com", "senha": "teste"}'
```

## Vídeo de Execução

Veja um vídeo curto de execução da aplicação: [https://youtu.be/oUwb5SjlRE0](https://youtu.be/oUwb5SjlRE0).

## Vídeo de Referência

[https://www.youtube.com/live/JrT5YV1KMeY?si=n2kRSCtEjWjYtay5](https://www.youtube.com/live/JrT5YV1KMeY?si=n2kRSCtEjWjYtay5)

<script>
document.getElementById('download-vpc').addEventListener('click', function(event) {
    event.preventDefault();
    const url = this.href;
    const fileName = 'amazon-eks-vpc-private-subnets.yml';

    fetch(url)
    .then(response => response.blob())
    .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    })
    .catch(() => alert('Erro'));
});
</script>

<script>
document.getElementById('download-db').addEventListener('click', function(event) {
    event.preventDefault();
    const url = this.href;
    const fileName = 'db-deployment.yml';

    fetch(url)
    .then(response => response.blob())
    .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    })
    .catch(() => alert('Erro'));
});
</script>

<script>
document.getElementById('download-web').addEventListener('click', function(event) {
    event.preventDefault();
    const url = this.href;
    const fileName = 'web-deployment.yml';

    fetch(url)
    .then(response => response.blob())
    .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    })
    .catch(() => alert('Erro'));
});
</script>

<style>
body {
    line-height: 1.8;
}

p {
    line-height: 1.8;
}

ul, ol {
    line-height: 1.8;
}

.terminal {
    background-color: #1e1e1e;
    color: #fff;
    font-family: "Courier New", monospace;
    padding: 15px;
    border-radius: 5px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    width: 600px;
    margin: 20px auto;
}

</style>
