# Deploy da aplicação no AWS

Para acessar a API restful que foi implementada na AWS você pode acessar o seguinte link: [aqui](http://ac7b724c423524cd4adfddf70f4bc128-1009402681.us-east-2.elb.amazonaws.com/docs/). Por aqui você pode acessar o swagger da API, que é uma representação visual dos endpoints, e ver exemplos de como devem ser os parâmetros. Entretanto, o swagger está com algum problema de CORS que eu não consegui resolver, então eu recomendaria a utilização do postman ou a utilização de chamadas CUrl para testar os endpoints da API. As instruções de como fazer isso estão na página anterior dessa documentação, apenas garanta que está utilizando o seguinte link: [aqui](http://ac7b724c423524cd4adfddf70f4bc128-1009402681.us-east-2.elb.amazonaws.com).

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

4.  **Criação do Cluster EKS**:

    Para criar um cluster EKS, a [documentação](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html) foi seguida. O comando `eksctl create cluster` foi utilizado. O comando utilizado foi o seguinte:

    <div class="terminal">eksctl create cluster --name henrique-app --region us-east-2 --nodes 2 --node-type t3.medium</div>

    Este comando utiliza o `eksctl` para criar um cluster Kubernetes no serviço EKS. Ele especifica o nome do cluster, a região, o número de nós de trabalho e o tipo de instância. Os nós são responsáveis por executar os containers da aplicação. As instâncias do tipo `t3.medium` são o suficiente para acomodar a aplicação, uma vez que ela não é muito grande. Além disso, o comando supõe outras configurações padrão para subir o cluster que, caso queiram ser configuradas, podem ser mais detalhadas num arquivo de configuração, como descrito na documentação oficial [aqui](https://docs.aws.amazon.com/eks/latest/userguide/quickstart.html).

5.  **Configurar o Contexto do Kubectl**:

    Após criar o cluster, foi configrado o contexto do `kubectl` para se conectar ao cluster EKS:

    <div class="terminal">aws eks --region us-east-2 update-kubeconfig --name henrique-app</div>

    Este comando atualiza o arquivo de configuração `kubeconfig` para permitir que o `kubectl` se comunique com o cluster recém-criado. É uma etapa essencial para gerenciar os recursos do Kubernetes no cluster.

6.  **Criação do Arquivo db-deployment.yaml**:

    Criou-se um arquivo `db-deployment.yaml` com as configurações do deployment para a base de dados.

    Ele pode ser baixado aqui caso queira usá-lo como exemplo:

    <a href="https://raw.githubusercontent.com/HenriqueFBadin/ProjetoCloud/main/db-deployment.yml" id="download-db">
    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
    Baixar db-deployment.yml
    </button>
    </a>

7.  **Criação do Arquivo web-deployment.yaml**:

    Criou-se um arquivo `web-deployment.yaml` com as configurações do deployment para a base de dados.

    Ele pode ser baixado aqui caso queira usá-lo como exemplo:

    <a href="https://raw.githubusercontent.com/HenriqueFBadin/ProjetoCloud/main/web-deployment.yml" id="download-web">
    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
    Baixar web-deployment.yml
    </button>
    </a>

8.  **Deployment dos clusters**:

    Execute os comandos abaixo para realizar o deployment do banco de dados e da aplicação web:

    <div class="terminal">kubectl apply -f db-deployment.yaml
    kubectl apply -f web-deployment.yaml
    </div>

9.  **Verificando status dos deployments**:

    Para encontrar possíveis erros, é importante verificar o status dos deployments. Alguns comandos úteis são:

    - `kubectl describe deployment <deployment-name>`: Mostra informações detalhadas sobre um deployment.

    <div class="terminal">kubectl describe deployment nodejs</div>

    - `kubectl get all`: Mostra todos os recursos do cluster.

    <div class="terminal">kubectl get all</div>

    - `kubectl get pods`: Mostra todos os pods do cluster.

    <div class="terminal">kubectl get pods</div>

    - `kubectl logs <pod-name>`: Mostra os logs de um pod específico.

    <div class="terminal">kubectl logs nodejs-app-5d5d55f889-p86q8</div>

10. **Obtendo o link da aplicação**:

    Para obter o link da aplicação, foi utilizado o comando abaixo:

    <div class="terminal">kubectl get svc nodejs-app</div>

    Este comando exibe informações sobre o serviço, incluindo o endereço IP ou URL que pode ser usado para acessar a aplicação.

## Como testar a aplicação?

Para testar a aplicação, você pode acessar o link da aplicação que foi obtido no passo anterior.

Com esse link, podemos utilizar o postman ou realizarmos chamadas CUrl para testar os endpoints da API. A seguir, temos um exemplo de como realizar uma chamada CUrl para os endpoints da API usando o powershell:

- Registro:

```bash
curl -X POST "http://ac7b724c423524cd4adfddf70f4bc128-1009402681.us-east-2.elb.amazonaws.com/registrar" -H "Content-Type: application/json" -d '{"nome": "2111", "email": "teste2111@gmail.com", "senha": "cloudo"}'
```

- Login:

```bash
curl -X POST "http://ac7b724c423524cd4adfddf70f4bc128-1009402681.us-east-2.elb.amazonaws.com/login" -H "Content-Type: application/json" -d '{"email": "teste1811@gmail.com", "senha": "cloudo"}'
```

- Consultar imagem:

```bash
Invoke-RestMethod -Uri 'http://ac7b724c423524cd4adfddf70f4bc128-1009402681.us-east-2.elb.amazonaws.com/consultar' -Method GET -Headers @{ "Content-Type" = "application/json"; "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibm9tZSI6InRlc3RlMTgxMSIsImVtYWlsIjoidGVzdGUxODExQGdtYWlsLmNvbSIsImlhdCI6MTczMjE2NzMyNSwiZXhwIjoxNzMyMTcwOTI1fQ.xRChB16g7PrmogMNRTvcN3cZ6PV85rtO6GOveCZ6rIE" } -Body '{"email": "teste1811@gmail.com", "senha": "cloudo"}'
```

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
