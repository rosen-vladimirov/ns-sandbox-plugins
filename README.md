# ns-sandbox-plugins
A project used for testing sandboxing of plugin installation

## Usage
* Clone this repo:
```
$ git clone https://github.com/rosen-vladimirov/ns-sandbox-plugins.git
```
* Navigate to the inner `ns-sandbox-plugins` directory, where the project is located.
```
$ cd ns-sandbox-plugins/ns-sandbox-plugins
```
* You can directly build the project:
```
$ appbuilder build ios --download
```
* In order to verify the output of the commands from `commands.txt` file, extract the `.ipa` and check the content of `<unzipped .ipa>/Payload/NativeScript250/app/hooks.txt` file.
* You can modify commands.txt file in `ns-plugin-sandbox-test` directory in order to change the commands which you want to execute.


## How it works
The project inside `ns-sandbox-plugins` directory has a localy installed plugin called `ns-plugin-sandbox-test`. The plugin is used to execute different operations in it's after-prepare hook.
The operations are defined in `<repo>/ns-sandbox-plugins/ns-plugin-sandbox-test/commands.txt` file. Each operation starts on a new line. </br>
The result of each operation is written to `hooks.txt` inside the built `.ipa`/`.apk`.</br>
`hooks.txt` is located in:
* `<unzipped .ipa>/Payload/NativeScript250/app/hooks.txt` for iOS
* `<unzipped .apk>/assets/app/hooks.txt` for Android
</br>
The format of the `hooks.txt` file is:
```
### Executing command <command1>
<result of command1 execution>

### Finished executing command <command1>
### Executing command <command2>
<result of command2 execution>

### Finished executing command <command2>
```
When any of the operations defined in commands.txt is not allowed, the process will be terminated immediately. The consecutive lines from `commands.txt` will not be executed and the build will fail.
In the `<repo>/ns-sandbox-plugins/.ab/build.log` you should find an error similar to:
```
Warning: cat: /etc/hosts: Operation not permitted
Warning: Command failed: cat /etc/hosts
cat: /etc/hosts: Operation not permitted
```

The project targets NativeScript 2.5. In case you want to use it with any other NativeScript version, you can execute:
```
$ appbulder mobileframework set <version>
```
> NOTE: After that the path where `hooks.txt` will be placed in the `.ipa` may change (as it contains NS version in the path).

## Format of commands.txt
Each command that you want to execute must be placed on a new line.
In case you want to have some command in the file, but you do not want to execute it in particular case, just place `#` at the beginning. For example:
```
ls -l .
# cat /etc/hosts
ls -l /
```
The command `cat /etc/hosts` will not be executed.

In case you want to create a new file and you want to see it in the output `.ipa` or `.apk`, you can use the `${appDir}` placeholder. This dir is the `<unzipped .ipa>/Payload/NativeScript250/app/` path and will be replaced at runtime by the hook.
So in case you want to create new file with content "myContent", you can add the following line to `commands.txt`:
```
echo "myContent" > ${appDir}/myContentFile.txt
```
And when you unzip the `.ipa`, the file will be at `<unzipped .ipa>/Payload/NativeScript250/app/myContentFile.txt`.

## Commands that should fail
* All commands starting with `sudo`.
* Reading of system files: `cat /etc/hosts`.